import React, { useState } from "react";
import "../../css/components/Modal/SelectReceiverModal.css";
import AdminChatIcon from "../../assets/images/adminchat.png";

function SelectReceiverModal({ isOpen, onClose, receiverId, senderId }) {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      receiverId,
      senderId,
      messageContent: message,
      sendTime: new Date().toISOString(),
    };

    try {
      const response = await fetch("${process.env.REACT_APP_API_URI}/api/chat/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      console.log("Message sent successfully:", data);
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    isOpen && (
      <div className="chat-modal-overlay">
        <div className="chat-modal-content">
          <div className="chat-modal-header">
            <img src={AdminChatIcon} className="chat-icon"></img>
            <div className="chat-header-text">궁금한 메세지를 보내세요</div>
          </div>
          <div className="chat-modal-body">
            <form onSubmit={handleSubmit}>
              <textarea
                className="message-input-modal-box"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="내용을 입력하세요..."
                rows="4"
                cols="50"
              />
              <div className="chat-btn-wrap">
                <button className="chat-btn-content chat-send-btn" type="submit">Send</button>
                <button className="chat-btn-content chat-close-btn" type="button" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

export default SelectReceiverModal;
