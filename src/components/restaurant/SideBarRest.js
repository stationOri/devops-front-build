import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/oriblue.png";
import Food from "../../assets/images/sidebar/food.png";
import Rest from "../../assets/images/sidebar/rest.png";
import Reservation from "../../assets/images/sidebar/reservation.png";
import Chat from "../../assets/images/sidebar/chat.png";
import RestUser from "../../assets/images/sidebar/restuser.png";
import ExtendBtn from "../../assets/images/sidebar/menubtn.png";
import Waiting from "../../assets/images/sidebar/waiting.png";
import Login from "../../assets/images/sidebar/login.png";
import CheckModal from "../Modal/CheckModal";
import SelectReceiverModal from "../Modal/SelectReceiverModal";
import { useCheckModal } from "../Modal/CheckModalContext";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SideBarRest({
  onMenuClick,
  isExtended,
  toggleSidebar,
  onRestIdChange,
}) {
  const { openCheckModal } = useCheckModal();
  const query = useQuery();
  const [restId, setRestId] = useState("");
  const token = query.get("token"); // 'token'은 URL에서의 파라미터 이름
  const [username, setUsername] = useState("Guest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatType, setChatType] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const [receiverId, setReceiverId] = useState(null); // 선택된 수신자
  const [senderId, setSenderId] = useState(null); // 발신자 ID

  const handleOpenModal = () => {
    openCheckModal("관리자 문의 실패", "로그인이 되어있지 않습니다.");
  };

  const handleSidebarTextClick = (text) => {
    if (onMenuClick) {
      onMenuClick(text); // 클릭된 메뉴명을 RestMain으로 전달
    }
  };

  useEffect(() => {
    const signinok = query.get("signin");
    if (signinok === "true") {
      try {
        localStorage.setItem("token", token);
        const userinfo = jwtDecode(token);
        setUsername("Guest");
      } catch (error) {
        console.error("Invalid token", error);
      }
    } else {
      try {
        const storedToken = localStorage.getItem("token");
        let userinfo = null;
        if (storedToken) {
          if (token) {
            localStorage.setItem("token", token);
          }
          userinfo = jwtDecode(token);
          console.log("userinfo", userinfo);
        } else {
          localStorage.setItem("token", token);
          userinfo = jwtDecode(token);
          console.log("userinfo", userinfo);
        }
        if (userinfo.object.loginDto) {
          setUsername(userinfo.userName);
          setRestId(userinfo.RestId);
          setIsLoggedIn(true);
          onRestIdChange(userinfo.object.loginDto.id);
          setChatType(userinfo.object.loginDto.chatType);
          setSenderId(userinfo.object.loginDto.id); // 발신자 ID 설정
        } else {
          setUsername("Guest");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, [token, setRestId, onRestIdChange]);

  const handleLogout = () => {
    const currentUrl = new URL(window.location.href); 
    currentUrl.searchParams.delete('token');
    window.history.replaceState({}, document.title, currentUrl.toString());
    setIsLoggedIn(false);
    setUsername("Guest");
    navigate('/');
    localStorage.removeItem('token');
  };

  // 수신자 ID를 설정
  const handleOpenSelectReceiverModal = () => {
    setReceiverId(1348); // 관리자 id
    setIsModalOpen(true);
  };

  const handleCloseSelectReceiverModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`sideBarWrapper ${isExtended ? "extended" : "collapsed"}`}>
      <div className="sideBarHeader">
        <div className="iconWrapper">
          <img src={Logo} alt="" className="sidebarLogo" />
          {isExtended && <div className="guestText">{username}</div>}
        </div>
      </div>
      <button className="extendbtn" onClick={toggleSidebar}>
        <img src={ExtendBtn} alt="" className="extendbtnImg" />
      </button>
      <div className="sidebarContent">
        <div className="sidebarRow">
          <div className={`ctgText ${isExtended ? "" : "hidden"}`}>MAIN</div>
        </div>
        <div className="sidebarRow">
          <img src={Rest} alt="" className="sidebarIcon" />
          <div
            className={`sidebarText ${isExtended ? "" : "hidden"}`}
            onClick={() => handleSidebarTextClick("식당정보")}
          >
            식당정보
          </div>
        </div>
        <div className="sidebarRow">
          <img src={Food} alt="" className="sidebarIcon rest" />
          <div
            className={`sidebarText ${isExtended ? "" : "hidden"}`}
            onClick={() => handleSidebarTextClick("메뉴 관리")}
          >
            메뉴 관리
          </div>
        </div>
        <div className="sidebarRow">
          <img src={Reservation} alt="" className="sidebarIcon" />
          <div
            className={`sidebarText ${isExtended ? "" : "hidden"}`}
            onClick={() => handleSidebarTextClick("예약")}
          >
            예약
          </div>
        </div>
        <div className="sidebarRow">
          <img src={Waiting} alt="" className="sidebarIcon" />
          <div
            className={`sidebarText ${isExtended ? "" : "hidden"}`}
            onClick={() => handleSidebarTextClick("웨이팅 관리")}
          >
            웨이팅 관리
          </div>
        </div>
        <div className="sidebarRow">
          <img src={Chat} alt="" className="sidebarIcon" />
          <div
            className={`sidebarText ${isExtended ? "" : "hidden"}`}
            onClick={() => handleSidebarTextClick("1:1 문의")}
          >
            1:1 문의
          </div>
        </div>

        <div className="userContent">
          <div className="sidebarRow">
            <div className={`ctgText ${isExtended ? "" : "hidden"}`}>USER</div>
          </div>
          <div className="sidebarRow">
            <img src={RestUser} alt="" className="sidebarIcon" />
            <div
              className={`sidebarText ${isExtended ? "" : "hidden"}`}
              onClick={() => handleSidebarTextClick("계정 정보")}
            >
              계정 정보
            </div>
          </div>
          <div className="sidebarRow">
            <img src={Login} alt="" className="sidebarIcon" />
            <div
              className={`sidebarText ${isExtended ? "" : "hidden"}`}
              onClick={handleLogout}
            >
              로그아웃
            </div>
          </div>
        </div>
        <button
          className={`sidebaraskButton ${isExtended ? "" : "hidden"}`}
          onClick={handleOpenSelectReceiverModal}
        >
          관리자 문의
        </button>
      </div>
      <CheckModal />
      <SelectReceiverModal
        isOpen={isModalOpen}
        onClose={handleCloseSelectReceiverModal}
        receiverId={receiverId}
        senderId={senderId}
      />
    </div>
  );
}

export default SideBarRest;
