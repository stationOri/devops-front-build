// RestCancelModal.js
import React, { useEffect, useState } from 'react';
import "../../css/components/Modal/CheckModal.css";
import "../../css/components/Modal/CancelModal.css";
import "../../css/components/Modal/RestCancelModal.css";
import axios from 'axios';
function RestCancelModal({ RestCancelClose, restcancelshow, reservation }) {
  const [selectedReason, setSelectedReason] = useState(null);

  const handleCancel = async () => {
   
    if (selectedReason) {
      try{
        const response = await  axios.put(`${process.env.REACT_APP_API_URI}/api/reservations/status/${reservation.resId}`, {
          status: "RESERVATION_REJECTED",
          reason: selectedReason
        }, {
          headers: { "Content-Type": "application/json" }
        });
        if (response.data==='success') {
            alert('예약 거절 및 알림 완료, 상태 반영을 원한다면 날짜 선택 및 조회를 다시 해주세요.')
          } else {
            alert(response.data);
          }
        } catch (error) {
          console.error('Error updating reservation status:', error);
          alert('An error occurred while updating reservation status.')
        }
        
        RestCancelClose();
    } else {
      console.log('Reservation cancelled. No reason selected');
      alert("예약 거절 이유를 선택해주세요. ")
    }
    
    
  };

  const handleReject =  () => {
    RestCancelClose();
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
  };

  return (
    <div
      id={restcancelshow ? "resbackgroundon" : "resbackgroundoff"}
      onClick={(e) => {
        if (
          e.target.id === "resbackgroundon" ||
          e.target.id === "resbackgroundoff"
        ) {
          RestCancelClose();
        }
      }}
    >
      <div className={`restcancelModal ${restcancelshow ? "checkshow" : "checkhide"}`}>
        <div className="checkModalContent">
          <div className="checkboldText">예약을 취소하시겠습니까?</div>
          <hr className="checkmodalline" />
          <div className="checkhintText">
            예약금은 취소 일시에 관계 없이 사용자에게 전액 환불 처리됩니다.
          </div>
          <div className='cancelmodalReasonWrapper'>
            <button
              className={`cancelmodalReasonBtn ${selectedReason === "내부 사정" ? "selectedReason" : ""}`}
              onClick={() => handleReasonClick("내부 사정")}
            >
              내부 사정
            </button>
            <button
              className={`cancelmodalReasonBtn ${selectedReason === "메뉴 주문 불가" ? "selectedReason" : ""}`}
              onClick={() => handleReasonClick("메뉴 주문 불가")}
            >
              메뉴 주문 불가
            </button>
          </div>
          <div className="resacceprmodalfoot cancelmodaldetail">
            <button
              className={`resModalBtn ${!selectedReason ? 'disabled' : ''}`}
              onClick={handleCancel}
              disabled={!selectedReason}
            >
              취소승인
            </button>
            <button
              className={`resModalBtnno`}
              onClick={handleReject}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestCancelModal;
