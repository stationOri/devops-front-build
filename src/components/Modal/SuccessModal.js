import React from "react";
import { useSuccessModal } from "./SuccessModalContext";
import "../../css/components/Modal/SuccessModal.css";
import checkIcon from "../../assets/images/modal/check.png";
import peopleIcon from "../../assets/images/modal/people.png";
import calIcon from "../../assets/images/modal/cal.png";

function SuccessModal() {
  const { modalState, closeSuccessModal } = useSuccessModal();
  const { show, header, username, day, selectedTime, selectedGuests } =
    modalState;

  return (
    <div>
      <div
        id={show ? "checkbackgroundon" : "checkbackgroundoff"}
        onClick={(e) => {
          if (
            e.target.id === "checkbackgroundon" ||
            e.target.id === "checkbackgroundoff"
          ) {
            closeSuccessModal();
          }
        }}
      >
        <div className="success-modal-overlay">
          <div className="success-modal-content">
            <div className="modal-header">
              <div className="success-modal-header">
                <img src={checkIcon} className="success-icon" alt=""></img>
                <div className="success-header">{header}</div>
              </div>
            </div>
            <div className="modal-body">
              <div className="horizon"></div>
              <div className="success-username">{username}</div>
              <div className="horizon"></div>
              <div className="success-content">
                <div className="success-content-box">
                  <img src={calIcon} className="success-content-icon" alt=""></img>
                  <div className="success-text">
                    {day} | {selectedTime}
                  </div>
                </div>
                <div className="success-content-box">
                  <img src={peopleIcon} className="success-content-icon" alt=""></img>
                  <div className="success-text">
                    <span className="selected-guest">{selectedGuests}</span>{" "}
                    Guests
                  </div>
                </div>
              </div>
              <div className="horizon"></div>
              <div className="empty-enroll-btn">
                <div className="empty-btn-content" onClick={closeSuccessModal}>
                  확인
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
