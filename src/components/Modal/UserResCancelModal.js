import "../../css/components/Modal/AdminResCancelModal.css";
import "../../css/components/Modal/UserResCancelModal.css";

import { useState } from "react";
import axios from "axios";
function UserResCancelModal({ usercancelshow, reservation, UserCancelClose }) {
  const [isChecked, setIsChecked] = useState(false);
  const [showCheckMessage, setShowCheckMessage] = useState(false);

  const handleResCancel = async () => {
    console.log(reservation);
    try{
      const response = await  axios.put(`${process.env.REACT_APP_API_URI}/api/reservations/status/${reservation.resId}`, {
        status: "RESERVATION_CANCELED_BYUSER",
        reason: ""
      }, {
        headers: { "Content-Type": "application/json" }
      });
      if (response.data==='success') {
         alert('예약 취소 완료');
         
        } else {
          alert(response.data);
        }
      } catch (error) {
        console.error('Error updating reservation status:', error);
        alert('An error occurred while updating reservation status.')
      }
      UserCancelClose();
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
    UserCancelClose();
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
        id={usercancelshow ? "signinbackgroundon" : "signinbackgroundoff"}
        onClick={(e) => {
          if (e.target.id === "signinbackgroundon" || e.target.id === "signinbackgroundoff") {
            handleCloseModal();
          }
        }}
      >
        <div className={`signinModal ${usercancelshow ? "checkshow" : "checkhide"}`}>
          <div className="adminCancelModalContent">
            <div className="adminCancelboldText">예약을 취소하시겠습니까?</div>
            <div class="line2"></div>
            <div className="userCancelhintText">예약금은 예약 시 안내드린 <br></br>규정에 의거하여 환불됩니다.</div>
            <div className="userCancelhintText2">
            [이용 7일 전] &emsp; 예약금 전액 환불 <br></br>
            [이용 3일 전] &emsp; 예약금 50% 차감 환불<br></br>
            [이용 1일 전] &emsp; 예약금 90% 차감 환불<br></br>
            </div>
            <div className="userCancelhintText3">
            이후 취소불가 
            </div>
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
                내용을 확인했습니다.
              </label>
              </div>
              {showCheckMessage && !isChecked && (
                <div className="adminCancelCheckMessage">예약을 취소하려면 체크해 주세요.</div>
              )}
            </div>
            <div className="adminCancelBtnWrapper">
              <button id="adminCancelModalyesBtn" className="userCancelModalyesBtn" onClick={handleYesButtonClick}>네</button>
              <button className="userCancelModalnoBtn" onClick={handleCloseModal}>아니요</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserResCancelModal;
