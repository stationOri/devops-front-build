import React, { useEffect, useState } from "react";
import "../../css/components/Modal/WaitingSuccessModal.css";
import checkIcon from "../../assets/images/modal/check.png";
import peopleIcon from "../../assets/images/modal/people.png";
import restIcon from "../../assets/images/modal/rest.png";

function WaitingSuccessModal({ isOpen, onClose, userId, userPhone }) {

  const [waiting, setWaiting] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchWaiting();
    }
  }, [isOpen]);

  const fetchWaiting = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/waiting/user/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch waiting");
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      setWaiting(data);
    } catch (error) {
      setWaiting(null);
      console.error("Error fetching waiting:", error);
    } finally {
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="waiting-success-modal-background"
      onClick={(e) => {
        if (e.target.id === "waiting-success-modal-background") {
          onClose();
        }
      }}
    >
      <div className="waiting-success-modal-overlay">
        <div className="waiting-success-modal-content">
          <div className="modal-header">
            <div className="waiting-success-modal-header">
              <img
                src={checkIcon}
                className="success-icon"
                alt="check icon"
              ></img>
              <div className="success-header">웨이팅 등록 성공</div>
            </div>
          </div>
          <div className="modal-body">
            <div className="horizon"></div>
            <div className="success-username">{userPhone}</div>
            <div className="horizon"></div>
            <div className="success-content">
              <div className="success-content-box">
                <img
                  src={restIcon}
                  className="success-rest-icon"
                  alt="rest icon"
                ></img>
                <div className="success-text">{waiting?.restName}</div>
              </div>
              <div className="success-content-box">
                <img
                  src={peopleIcon}
                  className="success-content-icon"
                  alt="people icon"
                ></img>
                <div className="success-text">
                  <span className="selected-guest">{waiting?.waitingPpl}</span>{" "}
                  Guests
                </div>
              </div>
            </div>
            <div className="horizon"></div>
            <div className="waiting-success-content">
              <div className="success-content-box">
                대기번호
                <div className="success-text">
                  <span className="waiting-num">{waiting?.waitingNum}</span>
                </div>
                번
              </div>
              <div className="success-content-box ma3"> || </div>
              <div className="success-content-box">
                현재 남은 웨이팅
                <div className="success-text">
                  <span className="waiting-num">{waiting?.waitingLeft}</span>{" "}
                </div>
                팀
              </div>
            </div>
            <div className="waiting-success-info">
              <div>입장 차례에 입력하신 번호로</div>
              <div>알림톡을 보내드립니다.</div>
            </div>
            <div className="waiting-enroll-btn">
              <div className="waiting-btn-content" onClick={onClose}>
                확인
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingSuccessModal;
