import React, { useState } from "react";
import "../../css/components/chatt/Chat.css";
import Loading from "../Loading";
import ChatList from "./Chatlist";
import ChatRoom from "./ChatRoom";
import MessageInput from "./MessageInput";
import ChatImg from "../../assets/images/chatorange.png";

const RestChat = ({ restId }) => {
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [selectedChatAnsName, setSelectedChatAnsName] = useState(null);
  const [selectedChatQsName, setSelectedChatQsName] = useState(null);
  const [selectedChatQsId, setSelectedChatQsId] = useState(null);
  const [selectedChatAnsId, setSelectedChatAnsId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleChatSelect = async (chattingRoomId, ansName, qsName, qsId, ansId) => {
    setSelectedChatRoomId(chattingRoomId);
    setSelectedChatAnsName(ansName);
    setSelectedChatQsName(qsName);
    setSelectedChatQsId(qsId);
    setSelectedChatAnsId(ansId);

    console.log("ansName:", ansName);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="container">
      <div className="chat-container">
        <div className="chat-menu-title">
          <img src={ChatImg} alt="" className="chat-title-img" />
          <div className="chat-menu-title-content">1:1 문의</div>
        </div>
        <div className="real-chat-content">
          <div className="chat-list">
            <ChatList
              userId={restId}
              onChatSelect={handleChatSelect}
              refreshTrigger={refreshTrigger}
              chatType="admin"
              currentUserId={restId}
            />
          </div>
          <div className="chat-messages-wrap">
            <div className="chat-messages">
              {selectedChatRoomId ? (
                <ChatRoom
                  chattingRoomId={selectedChatRoomId}
                  ansName={selectedChatAnsName}
                  qsName={selectedChatQsName} 
                  qsId={selectedChatQsId}
                  ansId={selectedChatAnsId}
                  refreshTrigger={refreshTrigger}
                  chatType="ans"
                  currentUserId={restId}
                />
              ) : (
                <div className="chat-no-message">
                  <div>채팅방이 없습니다.</div>
                </div>
              )}
            </div>
            <div className="chat-input-box">
              {loading ? (
                <Loading />
              ) : (
                <MessageInput
                  chattingRoomId={selectedChatRoomId}
                  userId={restId}
                  onMessageSent={handleRefresh}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestChat;
