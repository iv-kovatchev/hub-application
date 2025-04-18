const API_BASE_URL = "http://localhost:5098";

export const uploadImage = async (file: File, folder: "users" | "channels"): Promise<string | null> => {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/api/upload/image/${folder}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    if (!response.ok) {
        const body = await response.json().catch(() => null);
        const message = body?.message || response.statusText;
        throw new Error(message);
    }

    const data = await response.json();
    return data.imageUrl || null;
}