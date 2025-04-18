import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChannelMessage, useChannel } from "./useChannel"
import { Box } from "@mui/system";
import { Button, CircularProgress, Divider, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const Channel = () => {
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const channel = state?.channel;
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [input, setInput] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("accessToken") || "";

  const { sendMessage, connected } = useChannel(
    channel?.id,
    token,
    (msg) => setMessages((prev) => [...prev, msg]),
    (users: string[]) => setOnlineUsers(users)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, user!);
    setInput("");
  };

  const handleLeave = () => {
    navigate("/dashboard");
  };

  if (!channel) return <div>No channel selected.</div>;

  return (
    <Box display="flex" sx={{ mt: "16px" }}>
      {/* Chat Section */}
      <Box
        flex={3}
        display="flex"
        flexDirection="column"
        borderRight={1}
        borderColor="divider" p={2}
        height="calc(95vh - 98px)"
      >
        <Box display="flex" sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" gutterBottom>
            Channel: {channel?.name}
          </Typography>
          <Button variant="outlined" color="error" onClick={handleLeave} sx={{ alignSelf: "flex-start", justifySelf: "flex-end" }}>
            Leave
          </Button>
        </Box>

        <Paper variant="outlined" sx={{ flex: 1, overflowY: "auto", minHeight: 0, p: 2, mt: "16px" }}>
          {messages.map((msg, index) => (
            <Box key={index} mb={1}>
              <Typography variant="body2">
                [{new Date(msg.sentAt).toLocaleTimeString()}] <strong>{msg.user}</strong>: {msg.text}
              </Typography>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Paper>

        <Box mt={2} display="flex" gap={1}>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Box>
      </Box>

      {/* Online Users Section */}
      <Box flex={1} p={2} height="calc(95vh - 98px)" display="flex" flexDirection="column">
        <Typography variant="h6" gutterBottom>
          Online users
        </Typography>
        <Paper variant="outlined" sx={{ height: "100%", overflowY: "auto", p: 2, mt: "16px" }}>
          <List>
            {onlineUsers.map((user, index) => (
              <ListItem key={index}>
                <ListItemText primary={user} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Channel;