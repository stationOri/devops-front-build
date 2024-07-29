import React, { useState, useEffect } from "react";
import "../../css/components/chatt/ChatList.css";
import planeImg from "../../assets/images/plane.png";
import planeBlueImg from "../../assets/images/planeblue.png";

function ChatList({
  userId,
  onChatSelect,
  chatImg = "default",
  refreshTrigger,
  currentUserId
}) {
  const [chatLists, setChatLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const getChatImage = (ansName) => {
    if (ansName === "관리자") {
      return planeBlueImg;
    }
    switch (chatImg) {
      case "blue":
        return planeBlueImg;
      case "default":
      default:
        return planeImg;
    }
  };

  const getChatList = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/chat/user/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setChatLists(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatList();
  }, [userId, refreshTrigger]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleChatSelect = (chat) => {
    onChatSelect(
      chat.chattingRoomId,
      chat.ansName,
      chat.qsName,
      chat.qsId,
      chat.ansId
    ); // 추가된 인자 전달
    console.log(chat.ansId);
    console.log(chat.ansName);
    console.log(chat.qsId);
    console.log(chat.qsName);
  };

  const filteredChatLists = searchTerm
    ? chatLists.filter(
        (chatList) =>
          chatList.qsName.toLowerCase().includes(searchTerm) ||
          chatList.ansName.toLowerCase().includes(searchTerm)
      )
    : chatLists;

  const truncateMessage = (message) => {
    return message.length > 20 ? message.substring(0, 20) + "..." : message;
  };

  const getDisplayName = (chatList) => {
    // if (chatList.ansName === "관리자") {
    //   return "관리자";
    // }
    const isCurrentUserQs = currentUserId === chatList.qsId;
    const isCurrentUserAns = currentUserId === chatList.ansId;
    if (isCurrentUserQs) {
      return chatList.ansName;
    } else if (isCurrentUserAns) {
      return chatList.qsName;
    }
    return chatList.qsName;
  };

  return (
    <aside className="sidebar">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search people"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="chat-list">
        {filteredChatLists.map((chatList) => (
          <li
            key={chatList.chattingRoomId}
            className="chat-item"
            onClick={() => handleChatSelect(chatList)}
          >
            <img
              className="chat-img"
              src={getChatImage(chatList.ansName)}
              alt={chatList.ansName}
            />
            <div className="chat-info">
              <h3>
              {getDisplayName(chatList)}
              </h3>
              <p>{truncateMessage(chatList.lastMsg)}</p>
            </div>
          </li>
        ))}
      </div>
    </aside>
  );
}

export default ChatList;
