import React, { useState, useEffect } from "react";
import "../../css/components/chatt/ChatRoom.css";

function ChatRoom({
  chattingRoomId,
  ansName,
  qsName,
  ansId,
  qsId,
  sentColor = "#FF8A00",
  chatType = "qs",
  refreshTrigger,
  currentUserId,
}) {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const getChatRoom = async () => {
    try {
      const response = await fetch(
        `https://waitmate.shop/api/chat/chat/${chattingRoomId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setChatRooms(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chattingRoomId) {
      getChatRoom();
    }
  }, [chattingRoomId, refreshTrigger]);

  console.log("qsId:", qsId);
  console.log("ansId:", ansId);
  console.log("currentUserId:", currentUserId);

  const sortedChatRooms = [...chatRooms].sort(
    (a, b) => new Date(a.sendTime) - new Date(b.sendTime)
  );

  const isAdmin = ansName === "관리자";
  const isCurrentUserQs = currentUserId === qsId;
  const headerName = isCurrentUserQs ? ansName : qsName;

  return (
    <div className="chat-window">
      {chatRooms.length > 0 ? (
        <div className="chat-header">
          <h2>{headerName}</h2>
        </div>
      ) : (
        <div className="chat-header">
          <h2>Chat Room</h2>
        </div>
      )}
      <div className="message-list">
        {sortedChatRooms.map((chatRoom) => (
          <div className="message-box" key={chatRoom.id}>
            <div
              className={`message-info ${
                chatRoom.senderId === currentUserId
                  ? "sent-info"
                  : "received-info"
              }`}
            >
              {chatRoom.senderId === currentUserId ? (
                <>
                  <span className="chat-senderTime mr-15">
                    {formatTimestamp(chatRoom.sendTime) || "No time"}
                  </span>
                  <span className="chat-senderName ">
                    {chatRoom.senderName}
                  </span>
                </>
              ) : (
                <>
                  <span className="chat-senderName mr-15">
                    {chatRoom.senderName}
                  </span>
                  <span className="chat-senderTime">
                    {formatTimestamp(chatRoom.sendTime) || "No time"}
                  </span>
                </>
              )}
            </div>
            <div
              className={`message ${
                chatRoom.senderId === currentUserId ? "sent" : "received"
              }`}
              style={
                chatRoom.senderId === currentUserId
                  ? { backgroundColor: sentColor }
                  : {}
              }
            >
              <div>{chatRoom.messageContent}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatRoom;