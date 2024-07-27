import React from "react";
import "../../css/components/Modal/ReportAcceptModal.css";

function ReportAcceptModal({ reportacceptshow, ReportAcceptClose }) {

  const handleAcceptRejectModal = (action) => {
    console.log(`${action} 버튼 클릭됨`);

    // 여기서 상태를 업데이트하거나, API 호출 등의 작업을 수행할 수 있음

    ReportAcceptClose();
  };

  return (
    <div
      id={reportacceptshow ? "signinbackgroundon" : "signinbackgroundoff"}
      onClick={(e) => {
        if (
          e.target.id === "signinbackgroundon" ||
          e.target.id === "signinbackgroundoff"
        ) {
          ReportAcceptClose();
        }
      }}
    >
      <div
        className={`reportModal ${
          reportacceptshow ? "signinshow" : "signinhide"
        }`}
      >
        <div className="acceptmodalcontentswrapper">
          <div className="ReportacceptModalHeader">
            <div className="ReportacceptboldText">신고 처리</div>
            <button className="acceptclosebtn" onClick={ReportAcceptClose}>
              X
            </button>
          </div>
          <div className="reportmodalhintText">
            신고 상태 변경 후, 취소 또는 재변경 불가능합니다. 신중히 선택해주세요.
          </div>
          <div className="reportacceptModalButton">
            <button
              className="acceptModalAccept reportbtn"
              onClick={() => handleAcceptRejectModal("승인")}
            >
              승인
            </button>
            <button
              className="acceptModalReject reportbtn"
              onClick={() => handleAcceptRejectModal("거절")}
            >
              반려
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportAcceptModal;
