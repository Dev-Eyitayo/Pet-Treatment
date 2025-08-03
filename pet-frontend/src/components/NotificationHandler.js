import { useEffect, useRef, useState } from "react";

export default function NotificationHandler({ onNewNotification }) {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // or sessionStorage

    if (!token) return;

    // Connect to WebSocket with token if needed
    socketRef.current = new WebSocket(
      `ws://localhost:8000/ws/notifications/?token=${token}`
    );

    socketRef.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("New notification:", data);

      // Pass it to parent or global state
      onNewNotification(data);
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  return null;
}
