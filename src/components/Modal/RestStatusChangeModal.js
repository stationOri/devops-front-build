import React from "react";
import "../../css/components/Modal/CheckModal.css";
import "../../css/components/Modal/CancelModal.css";
import "../../css/components/Modal/RevAcceptModal.css";
import Logo from "../../assets/images/oriblue.png";
import axios from "axios";

function RestStatusChangeModal({
  RevDetailClose,
  revdetailshow,
  reservation,
  RestChangeShow,
  RestCancelShow,
}) {
  const handlenavigate = () => {
    console.log(reservation);
    const today = new Date().toISOString().split("T")[0];
    const reservationDate = reservation.resDate.split(" ")[0];

    if (reservationDate !== today) {
      alert("상태 변경이 불가능합니다. 예약 날짜가 오늘이 아닙니다.");
      return;
    }

    RevDetailClose();
    RestChangeShow(reservation);
  };

  const handleCancel = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URI}/api/reservations/status/${reservation.resId}`,
        {
          status: "RESERVATION_CANCELED_BYREST",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data === "success") {
        alert(
          "예약 거절 및 알림 완료, 상태 반영을 원한다면 날짜 선택 및 조회를 다시 해주세요."
        );
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error("Error updating reservation status:", error);
      alert("An error occurred while updating reservation status.");
    }
    RevDetailClose();
  };

  const handleno = () => {
    handleCancel();
  };

  return (
    <div
      id={revdetailshow ? "resbackgroundon" : "resbackgroundoff"}
      onClick={(e) => {
        if (e.target.id === "resbackgroundon") {
          RevDetailClose();
        }
      }}
    >
      <div
        className={`revAcceptModal ${
          revdetailshow ? "checkshow" : "checkhide"
        }`}
      >
        <div className="signinModalHeader">
          <img src={Logo} alt="" className="signinori" />
          <button className="signinclosebtn" onClick={RevDetailClose}>
            X
          </button>
        </div>
        <div className="resAcceptModalContent">
          <div className="resacceprmodalheader">
            <div className="resmodalbold">예약 정보</div>
            <div className="resmodalhint">확정된 예약을 확인하세요.</div>
            <div className="resmodalresnum">
              예약 번호 : {reservation.res_id}
            </div>
          </div>
          <div className="resacceprmodalmid">
            <div className="nameRow">
              <div className="explainTextinAccept">예약자 이름</div>
              <div className="explaininputText">{reservation.userName}</div>
            </div>
            <hr className="grayline" />
            <div className="numRow">
              <div className="explainTextinAccept">예약 인원 수</div>
              <div className="explaininputText">{reservation.resNum}</div>
            </div>
            <hr className="grayline" />
            <div className="menuRow">
              <div className="explainTextinAccept">주문 메뉴</div>
              <div className="menuWrapper">
                {reservation.menuList.map((item, index) => (
                  <div className="acceptmodaltrWrapper" key={index}>
                    <div className="menutd menunamtinaccept">
                      {item.menuName}
                    </div>
                    <div className="menutd">{item.amount}개</div>
                  </div>
                ))}
              </div>
            </div>
            <hr className="grayline" />
            <div className="requestRow">
              <div className="explainTextinAccept">요청사항</div>
              <div className="explaininputText requestdetail">
                {reservation.request}
              </div>
            </div>
          </div>
          <div className="resacceprmodalfoot">
            <button className="resModalBtn" onClick={handlenavigate}>
              상태변경
            </button>
            <button className="resModalBtnno" onClick={handleno}>
              예약취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestStatusChangeModal;
