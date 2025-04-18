import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

export interface ChannelMessage {
    user: string;
    text: string;
    sentAt: string;
}

export const useChannel = (
    channelId: string,
    token: string,
    onMessageReceived: (msg: ChannelMessage) => void,
    onUsersUpdated: (users: string[]) => void
) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const disconnectingRef = useRef(false);
    const [connected, setConnected] = useState(false);


    useEffect(() => {
        let isCancelled = false;

        (async () => {
            await new Promise((resolve) => setTimeout(resolve, 200));

            // ✅ Re-check values after delay
            if (
                !channelId ||
                !token ||
                connectionRef.current ||
                disconnectingRef.current ||
                isCancelled
            ) {
                console.warn("🛑 Skipping SignalR init — missing data or already connected");
                return;
            }

            // 💬 Safe to continue with connection logic
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_BASE_URL}/chathub`, {
                    accessTokenFactory: () => token,
                })
                .withAutomaticReconnect({
                    nextRetryDelayInMilliseconds: (retryContext) =>
                        retryContext.previousRetryCount < 5
                            ? Math.pow(2, retryContext.previousRetryCount) * 1000
                            : null,
                })
                .build();

            connectionRef.current = connection;

            connection.on("ReceiveMessage", (msg) => {
                onMessageReceived(msg);
            });

            connection.on("UsersUpdated", (users: string[]) => {
                onUsersUpdated(users);
            });

            try {
                await connection.start();
                await connection.invoke("JoinChannel", channelId);
                console.log("✅ Connected to SignalR");
                setConnected(true);
            } catch (err) {
                console.error("❌ Connection failed", err);
            }
        })();

        return () => {
            isCancelled = true;

            const stopConnection = async () => {
                disconnectingRef.current = true;

                try {
                    if (
                        connectionRef.current?.state === signalR.HubConnectionState.Connected
                    ) {
                        await connectionRef.current.invoke("LeaveChannel", channelId);
                    }
                    await connectionRef.current?.stop();
                } catch (err) {
                    console.warn("⚠️ SignalR cleanup error:", err);
                } finally {
                    connectionRef.current = null;
                    disconnectingRef.current = false;
                    setConnected(false);
                }
            };

            stopConnection();
        };
    }, [channelId, token]);

    const sendMessage = async (text: string, user: string) => {
        if (connectionRef.current && connected) {
            try {
                await connectionRef.current.invoke("SendMessage", channelId, user, text);
            } catch (err) {
                console.error("Failed to send message", err);
            }
        }
    };

    return { sendMessage, connected };
};
