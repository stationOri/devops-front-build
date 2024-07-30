import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/components/Modal/WaitingEnrollModal.css";
import closeIcon from "../../assets/images/modal/x-close.png";
import emptyIcon from "../../assets/images/modal/emptyenroll.png";
import restIcon from "../../assets/images/modal/rest.png";
import WaitingSuccessModal from "./WaitingSuccessModal";
import Loading from "../Loading";

const WaitingEnrollModal = ({ isOpen, onClose, userId, restId, name }) => {
  const [restInfo, setRestInfo] = useState(null);
  const [waiting, setWaiting] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [userPhone, setUserPhone] = useState("");
  const [waitingCount, setWaitingCount] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchRestInfo();
      fetchWaiting();
    }
  }, [isOpen]);

  const fetchRestInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/info/res/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant info");
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setRestInfo(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWaiting = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/waiting/rest/${restId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch waiting");
      }
      const data = await response.json();
      const inQueueCount = data.filter(waiting => waiting.waitingStatus === "IN_QUEUE").length;
      setWaiting(data);
      setWaitingCount(inQueueCount);
    } catch (error) {
      setWaiting(null);
      console.error("Error fetching waiting:", error);
    }
  };

  const handleGuestIncrement = () => {
    const maxGuests = restInfo?.maxPpl || 10;
  
    if (selectedGuests < maxGuests) {
      setSelectedGuests(selectedGuests + 1);
    }
  };

  const handleGuestDecrement = () => {
    if (selectedGuests > 1) {
      setSelectedGuests(selectedGuests - 1);
    }
  };

  const handlePhoneChange = (e) => {
    setUserPhone(e.target.value);
  };

  const handleOpenSuccessModal = async () => {
    console.log("등록 버튼 클릭됨");
    const userPhoneString = String(userPhone);
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URI}/api/waiting`, {
        userId: userId,
        restId: restId,
        waitingPpl: selectedGuests,
        watingPhone: userPhoneString,
      });
      console.log("POST 요청 성공", response.data);
      if (response.data === -1) {
        alert("현재 웨이팅이 불가능합니다.");
        onClose()
      } else if (response.data === 0) {
        alert("현재 식당은 웨이팅을 받고있지 않습니다.")
        onClose()
      }
      else {
        setSuccessData(response.data);
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("웨이팅 요청 오류:", error.response || error.message);
      alert("웨이팅 요청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <div className="waiting-modal-header">
              <img className="waiting-icon" src={emptyIcon} alt="Empty" />
              <p className="waiting-enroll-title">웨이팅 등록</p>
            </div>
            <div className="close-btn-container">
              <button className="close-btn" onClick={onClose}>
                <img src={closeIcon} alt="Close" />
              </button>
            </div>
          </div>
          <div className="modal-body">
            <div className="horizon"></div>
            <div className="waiting-enroll-rest">
              <div className="waiting-enroll-rest-name-box">
                <img className="rest-icon" src={restIcon} alt="Rest" />
                <div className="waiting-enroll-rest-name">{name}</div>
              </div>
              <div className="waiting-now">현재 웨이팅 <span className="waiting-count">{waitingCount}</span> 팀</div>
            </div>
            <div className="horizon"></div>
            <div className="waiting-enroll-content">
              <div className="waiting-enroll-picker">
                <div className="waiting-enroll-phone-box">
                  <input
                    className="waiting-enroll-phone"
                    placeholder="번호"
                    value={userPhone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <div className="waiting-enroll-content-text">
                  <button
                    className="guest-picker-btn"
                    onClick={handleGuestDecrement}
                  >
                    -
                  </button>
                  <span className="guest-picker-value">
                    <span className="selected-guest">{selectedGuests}</span>{" "}
                    Guests
                  </span>
                  <button
                    className="guest-picker-btn"
                    onClick={handleGuestIncrement}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="waiting-enroll-content-text">
                해당 매장 웨이팅 등록 시,
              </div>
              <div className="waiting-enroll-content-text">
                타 매장 웨이팅 등록이 불가능합니다.
              </div>
            </div>
            <div className="waiting-enroll-btn">
              <div className="waiting-btn-content" onClick={handleOpenSuccessModal}>
                등록
              </div>
            </div>
          </div>
        </div>
      </div>
      {isSuccessModalOpen && successData && (
        <WaitingSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            onClose();
          }}
          userPhone={userPhone}
          userId={userId}
        />
      )}
    </>
  );
};

export default WaitingEnrollModal;