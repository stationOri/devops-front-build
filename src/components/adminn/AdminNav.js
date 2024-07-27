import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/components/adminn/AdminNav.css";

function AdminNav({ activeNavButton, setActiveNavButton }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest");
  const navigate = useNavigate();

  const handleNavButtonClick = (buttonName) => {
    setActiveNavButton(buttonName);
  };

  const handleLogout = () => {
    const currentUrl = new URL(window.location.href); 
    currentUrl.searchParams.delete('token');
    window.history.replaceState({}, document.title, currentUrl.toString());
    setIsLoggedIn(false);
    setUsername("Guest");
    navigate('/');
    localStorage.removeItem('token');
  };

  return (
    <div className="adminnav">
      <div className="adminNavWarpper">
        <button
          className={`adminnavmenu ${activeNavButton === "식당 관리" ? "active" : ""}`}
          onClick={() => handleNavButtonClick("식당 관리")}
        >
          식당 관리
        </button>
        <button
          className={`adminnavmenu ${activeNavButton === "사용자 관리" ? "active" : ""}`}
          onClick={() => handleNavButtonClick("사용자 관리")}
        >
          사용자 관리
        </button>
        <button
          className={`adminnavmenu ${activeNavButton === "1:1문의" ? "active" : ""}`}
          onClick={() => handleNavButtonClick("1:1문의")}
        >
          1:1문의
        </button>
        <button
          className={`adminnavmenu ${activeNavButton === "로그아웃" ? "active" : ""}`}
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default AdminNav;
