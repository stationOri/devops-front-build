
import React, { useEffect, useState } from 'react';
import "../../css/components/Modal/CheckModal.css";
import "../../css/components/Modal/CancelModal.css";
import "../../css/components/Modal/RestCancelModal.css";
import axios from 'axios';
function RestStatusModal({ RestChangeClose, restchangeshow, reservation }) {
  const [selectedReason, setSelectedReason] = useState(null);


  const handleCancel = async () => {
    if (selectedReason) {
      try{
        
        const response = await  axios.put(`https://waitmate.shop/api/reservations/status/${reservation.resId}`, {
          status:  selectedReason === '노쇼'? 'NOSHOW' : 'VISITED',
          reason: ""
        }, {
          headers: { "Content-Type": "application/json" }
        });
        if (response.data==='success') {
            alert('예약 상태 변경 완료, 화면에 상태 반영을 원한다면 날짜 선택 및 조회를 다시 해주세요.')
          } else {
            alert(response.data);
          }
        } catch (error) {
          console.error('Error updating reservation status:', error);
          alert('An error occurred while updating reservation status.')
        }
        
        RestChangeClose();
    } else {
      console.log('변경할 예약의 상태를 선택해 주세요.');
    }
    
  };

  const handleReject = () => {
    RestChangeClose();
  };

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
  };

  return (
    <div
      id={restchangeshow ? "resbackgroundon" : "resbackgroundoff"}
      onClick={(e) => {
        if (
          e.target.id === "resbackgroundon" ||
          e.target.id === "resbackgroundoff"
        ) {
          RestChangeClose();
        }
      }}
    >
      <div className={`restcancelModal ${restchangeshow ? "checkshow" : "checkhide"}`}>
        <div className="checkModalContent">
          <div className="checkboldText">예약 상태 변경</div>
          <hr className="checkmodalline" />
          <div className="checkhintText">
            변경 후 다시 변경할 수 없으니 신중히 선택해주세요.
          </div>
          <div className='cancelmodalReasonWrapper'>
            <button
              className={`cancelmodalReasonBtn ${selectedReason === "방문" ? "selectedReason" : ""}`}
              onClick={() => handleReasonClick("방문")}
            >
              방문
            </button>
            <button
              className={`cancelmodalReasonBtn ${selectedReason === "노쇼" ? "selectedReason" : ""}`}
              onClick={() => handleReasonClick("노쇼")}
            >
              노쇼
            </button>
          </div>
          <div className="resacceprmodalfoot cancelmodaldetail">
            <button
              className={`resModalBtn ${!selectedReason ? 'disabled' : ''}`}
              onClick={handleCancel}
              disabled={!selectedReason}
            >
              네
            </button>
            <button
              className={`resModalBtnno`}
              onClick={handleReject}
            >
              아니요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestStatusModal;
