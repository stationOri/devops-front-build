import React from "react";
import "../../css/components/adminn/AdminSideBar.css";

function AdminSideBar({ activeButton, setActiveButton }) {
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="adminSidebarWrapper">
      <div className="adminsidebarcontent">
        <button
          className={`adminSidebatText ${activeButton === "승인 대기" ? "active" : ""}`}
          onClick={() => handleButtonClick("승인 대기")}
        >
          승인 대기
        </button>
        <hr className="line"/>
        <button
          className={`adminSidebatText ${activeButton === "승인 완료" ? "active" : ""}`}
          onClick={() => handleButtonClick("승인 완료")}
        >
          승인 완료
        </button>
        <hr className="line"/>
        <button
          className={`adminSidebatText ${activeButton === "예약 내역" ? "active" : ""}`}
          onClick={() => handleButtonClick("예약 내역")}
        >
          예약 내역
        </button>
        <hr className="line"/>
        <button
          className={`adminSidebatText ${activeButton === "신고 내역" ? "active" : ""}`}
          onClick={() => handleButtonClick("신고 내역")}
        >
          신고 내역
        </button>
        <hr className="line"/>
        <button
          className={`adminSidebatText ${activeButton === "블랙리스트" ? "active" : ""}`}
          onClick={() => handleButtonClick("블랙리스트")}
        >
          블랙리스트
        </button>
      </div>
    </div>
  );
}

export default AdminSideBar;
