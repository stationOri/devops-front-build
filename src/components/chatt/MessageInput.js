import React, { useState, useEffect } from "react";
import "../../css/components/chatt/MessageInput.css";

function MessageInput({ chattingRoomId, userId, onMessageSent, btnColor = "#FF8A00" }) {
  const [message, setMessage] = useState("");
  const [qsId, setQsId] = useState(null);
  const [ansId, setAnsId] = useState(null);

  const determineReceiverId = () => {
    if (userId === qsId) {
      return ansId;
    } else if (userId === ansId) {
      return qsId;
    } else {
      console.error("Unable to determine receiverId.");
      return null;
    }
  };

  useEffect(() => {
    const fetchChatRoomDetails = async () => {
      try {
        const response = await fetch(`https://waitmate.shop/api/chat/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chat room details");
        }
        const data = await response.json();
        
        const chatRoom = data.find(room => room.chattingRoomId === chattingRoomId);
        
        if (chatRoom) {
          setQsId(chatRoom.qsId);
          setAnsId(chatRoom.ansId);
        }
      } catch (error) {
        console.error("Error fetching chat room details:", error);
      }
    };

    if (userId && chattingRoomId) {
      fetchChatRoomDetails();
    }
  }, [userId, chattingRoomId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending message:", message);

    const effectiveReceiverId = determineReceiverId();

    if (effectiveReceiverId === null) {
      console.error("Message cannot be sent: receiverId is invalid.");
      return;
    }

    const payload = {
      receiverId: effectiveReceiverId,
      senderId: userId,
      messageContent: message,
      sendTime: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8080/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("Message sent successfully:", responseData);

      if (onMessageSent) {
        onMessageSent(); // 메시지 전송 후 상태 업데이트
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setMessage("");
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        className="message-input-box"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요 .."
      />
      <button
        className="send-btn"
        type="submit"
        style={{ backgroundColor: btnColor }}
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;