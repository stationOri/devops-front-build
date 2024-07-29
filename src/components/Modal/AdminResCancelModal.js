import "../../css/components/Modal/AdminResCancelModal.css";
import React from "react";
import { useState } from "react";
import axios from "axios";
function AdminResCancelModal({ admincancelshow, reservation, AdminCancelClose }) {
  const [isChecked, setIsChecked] = useState(false);
  const [showCheckMessage, setShowCheckMessage] = useState(false);

  const handleResCancel = async () => {
    console.log(reservation);
    try{
      const response = await  axios.put(`${process.env.REACT_APP_API_URI}/api/reservations/status/${reservation.res_id}`, {
        status: "RESERVATION_CANCELED_BYADMIN",
        reason: ""
      }, {
        headers: { "Content-Type": "application/json" }
      });
      if (response.data==='success') {
         alert('예약 취소 및 사용자 알림 완료');
         
        } else {
          alert(response.data);
        }
      } catch (error) {
        console.error('Error updating reservation status:', error);
        alert('An error occurred while updating reservation status.')
      }
      AdminCancelClose();
  }

  const handleYesButtonClick = () => {
    if (!isChecked) {
      setShowCheckMessage(true);
    } else {
      handleResCancel(); 
      setIsChecked(false);
    }
  }

  const handleCloseModal = () => {
    AdminCancelClose();
    setIsChecked(false);
    setShowCheckMessage(false);
  }

  const handleCheckboxChange = () => {
    if (showCheckMessage) {
      setShowCheckMessage(false);
    }
    setIsChecked(!isChecked);
  }

  return (
    <div>
      <div
        id={admincancelshow ? "signinbackgroundon" : "signinbackgroundoff"}
        onClick={(e) => {
          if (e.target.id === "signinbackgroundon" || e.target.id === "signinbackgroundoff") {
            handleCloseModal();
          }
        }}
      >
        <div className={`signinModal ${admincancelshow ? "checkshow" : "checkhide"}`}>
          <div className="adminCancelModalContent">
            <div className="adminCancelboldText">예약을 취소하시겠습니까?</div>
            <div className="adminCancelhintText">예약금은 취소 일시에 관계 없이 사용자에게 전액 환불 처리 됩니다.</div>
            <div className="adminCancelCheckWrapper">
              <div className="admincancelcheckfirst">
              <label className="adminCancelCheckbox">
                <input
                  type="checkbox"
                  name="status"
                  value="예약취소"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                예약을 취소하고 싶습니다.
              </label>
              </div>
              {showCheckMessage && !isChecked && (
                <div className="adminCancelCheckMessage">예약을 취소하려면 체크해 주세요.</div>
              )}
            </div>
            <div className="adminCancelBtnWrapper">
              <button id="adminCancelModalyesBtn" className="adminCancelModalyesBtn" onClick={handleYesButtonClick}>네</button>
              <button className="adminCancelModalnoBtn" onClick={handleCloseModal}>아니요</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminResCancelModal;
