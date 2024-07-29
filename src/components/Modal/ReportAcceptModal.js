import React from "react";
import "../../css/components/Modal/ReportAcceptModal.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


function ReportAcceptModal({ reportacceptshow, ReportAcceptClose, restreport, userreport }) {

  const handleAcceptRejectModal = async (action) => {
    let reportStatus;
    if(action === "승인") {
      reportStatus = 'C';
    } else {
      reportStatus = 'B';
    }

    try {
      const storedToken = localStorage.getItem('token');
      const userinfo = jwtDecode(storedToken);
      const adminId = userinfo.object.loginDto.id;
      
      let response;
      if (restreport) {
        response = await axios.put("${process.env.REACT_APP_API_URI}/api/rest/report", {
          restReportId: restreport.restReportId,
          reportStatus,
          adminId
        });
      } else if (userreport) {
        response = await axios.put("${process.env.REACT_APP_API_URI}/api/userreport", {
          userReportId: userreport.userReportId,
          reportStatus,
          adminId
        });
      }

      if (!response || response.data <= 0) {
        throw new Error("Failed to fetch");
      } else {
        alert('신고 처리 완료');
      }

    } catch (error) {
      console.error("Error changing state:", error);
    }

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
