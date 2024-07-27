import React, { useState, useEffect } from "react";
import AdminNav from "../components/adminn/AdminNav";
import HeaderBlue from "../components/adminn/HeaderBlue";
import "../css/pages/AdminMain.css";
import AdminRestControl from "../components/adminn/AdminRestControl"
import AdminUserControl from "../components/adminn/AdminUserControl"
import AdminChat from "../components/chatt/AdminChat"
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function AdminMain() {
  const [activeNavButton, setActiveNavButton] = useState("식당 관리");
  const [adminId, setAdminId] = useState("");
  const query = useQuery();
  const token = query.get("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signinshow, setSigninshow] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [chatType, setChatType] = useState("");
  const [senderId, setSenderId] = useState(null); // 발신자 ID

  // useEffect(() => {
  //   setAdminId(1208);
  // }, [adminId]);

  useEffect(() => {
    const signinok = query.get("signin");
      if (signinok === "true") {
            try{
              localStorage.setItem("token", token);
            const userinfo = jwtDecode(token);
            setUsername("Guest");
            setSigninshow(true);
            } catch (error) {
              console.error("Invalid token", error);
            }
          }
      else{
            try {
              const storedToken = localStorage.getItem("token");
              let userinfo=null;
              if(storedToken){
                if(token){
                  localStorage.setItem("token", token);
                }
                userinfo = jwtDecode(token);
              }else{
                localStorage.setItem("token", token);
                userinfo = jwtDecode(token);
              }
              if(userinfo.object.loginDto){
                setUsername(userinfo.userName);
                setAdminId(userinfo.object.loginDto.id);
                setChatType(userinfo.object.loginDto.chatType);
                setIsLoggedIn(true); // 로그인 상태로 설정
                setSenderId(userinfo.object.loginDto.id); // 발신자 ID 설정
              }else{
                setUsername("Guest");
                setIsLoggedIn(false);
              }
            } catch (error) {
              console.error("Invalid token", error);
            }
          }
  }, [token, setAdminId]);

  const renderNavContent = () => {
    switch (activeNavButton) {
      case "식당 관리":
        return <AdminRestControl />;
      case "사용자 관리":
        return <AdminUserControl />;
      case "1:1문의":
        return <AdminChat adminId={adminId} />;
      case "로그아웃":
        return <div>로그아웃 컴포넌트</div>;
      default :
        return <AdminRestControl />;
    }
  };
  console.log("adminId:", adminId);

  return (
    <div className="adminMainWrapper">
      <div>
        <HeaderBlue />
        <AdminNav activeNavButton={activeNavButton} setActiveNavButton={setActiveNavButton} />
      </div>
      <div className="adminmaincontent">
        {renderNavContent()}
      </div>
    </div>
  );
}

export default AdminMain;
