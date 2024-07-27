import React from "react";

function AdminUserSideBar({ activeButton, setActiveButton }) {
  const handleButtonClick = (buttonName) => {
    if (buttonName) {
      setActiveButton(buttonName);
    }
  };

  return (
    <div className="adminSidebarWrapper">
      <div className="adminsidebarcontent">
        <button
          className={`adminSidebatText ${activeButton === "유저 목록" ? "active" : ""}`}
          onClick={() => handleButtonClick("유저 목록")}
        >
          유저 목록
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
        <hr className="line"/>
        <button
          className="adminSidebatText empty"
          onClick={() => handleButtonClick("")}
        >
          
        </button>
        <hr className="line"/>
        <button
          className="adminSidebatText empty"
          onClick={() => handleButtonClick("")}
        >
          
        </button>
      </div>
    </div>
  );
}

export default AdminUserSideBar;
