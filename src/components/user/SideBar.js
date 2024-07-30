import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/oriblue.png";
import Home from "../../assets/images/sidebar/home.png";
import Restaurant from "../../assets/images/sidebar/restaurant.png";
import Chat from "../../assets/images/sidebar/chat.png";
import Login from "../../assets/images/sidebar/login.png";
import Search from "../../assets/images/sidebar/search.png";
import ExtendBtn from "../../assets/images/sidebar/menubtn.png";
import "../../css/components/user/SideBar.css";
import SigninModal from "../Modal/SigninModal";
import SigninNaverModal from "../Modal/SigninNaverModal";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import LoginModal from "../Modal/LoginModal";
import SelectReceiverModal from "../Modal/SelectReceiverModal";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SideBar({ onMenuClick, isExtended, toggleSidebar, setUserId,setFlag, flag }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Guest");
  const [loginshow, setLoginshow] = useState(false);
  const [signinshow, setSigninshow] = useState(false);
  const [naversigninshow, setNaverSigninshow] = useState(false);
  const [chatType, setChatType] = useState("");
  const query = useQuery();
  const token = query.get("token");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기 상태
  const [receiverId, setReceiverId] = useState(null); // 선택된 수신자
  const [senderId, setSenderId] = useState(null); // 발신자 ID

  const isok=query.get("isok");
  const navigate = useNavigate();

  const handleSidebarTextClick = (text) => {
    if (onMenuClick) {
      onMenuClick(text);
    }
  };
  useEffect(()=>{
    console.log("isokcheck")
    switch(isok){
      case "1":
        console.log("1")
        alert ("해당 식당은 사용자 신고 누적으로 인해 사용 정지 상태입니다.");
        navigate("/");
        break;
      case "2":
        alert("해당 식당은 식당 등록 후 관리자 승인 대기 중입니다.");
        navigate("/");
        break;
      case "3":
        console.log("3")
        alert("해당 사용자는 리뷰 신고 누적으로 인해 사용 정지 상태입니다.");
        navigate("/");   
        break;
    }
  },[isok])
  
  useEffect(() => {
    // const signinok = query.get("signin");
    //   if (signinok === "true") {
    //         try{
    //           localStorage.setItem("token", token);
    //         const userinfo = jwtDecode(token);
    //         setUsername("Guest");
    //         setSigninshow(true);
    //         } catch (error) {
    //           console.error("Invalid token", error);
    //         }
    //       }
    //   else{
    console.log(query);
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
                setUserId(userinfo.object.loginDto.id);
                setChatType(userinfo.object.loginDto.chatType);
                setIsLoggedIn(true); // 로그인 상태로 설정
                setSenderId(userinfo.object.loginDto.id); // 발신자 ID 설정
              }else{
                setUsername("Guest");
                setIsLoggedIn(false);
              }const signinok = query.get("signin");
              console.log(signinok);
              if (signinok === "true") {
                setSigninshow(true);
              }
            } catch (error) {
              console.error("Invalid token", error);
            }
  }, []);

  // login modal 함수
  const loginClose = () => setLoginshow(false);
  const loginShow = () => setLoginshow(true);
  
  // 회원가입 modal 함수
  const signinClose = () => setSigninshow(false);
  const signinShow = () => setSigninshow(true);

  //네이버 회원가입 modal
  const naversigninClose = () => setNaverSigninshow(false);
  const naversigninShow = () => setNaverSigninshow(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUsername("User Name"); // 실제 사용자 이름 가져오기
  };

  const handleLogout = () => {
    const currentUrl = new URL(window.location.href); 
    currentUrl.searchParams.delete('token');
    window.history.replaceState({}, document.title, currentUrl.toString());
    setIsLoggedIn(false);
    setUsername("Guest");
    localStorage.removeItem('token');
    handleSidebarTextClick("홈");
    navigate('/');
  };
  

  // 수신자 ID를 설정
  const handleOpenSelectReceiverModal = () => {
    setReceiverId(1393); // 관리자 id
    setIsModalOpen(true);
  };

  const handleCloseSelectReceiverModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className={`sideBarWrapper ${isExtended ? "extended" : "collapsed"}`}>
      <SigninModal signinClose={signinClose} signinshow={signinshow} />
      <SigninNaverModal naversigninClose={naversigninClose} naversigninshow={naversigninshow}/>
      <LoginModal loginClose={loginClose} loginshow={loginshow} flag={flag} setFlag={setFlag}/>

      <div className="sideBarHeader">
        <div className="iconWrapper">
          <img src={Logo} alt="" className="sidebarLogo" />
          {isExtended && <div className="guestText">{username}</div>}
        </div>
        {/* <div
          className={`sidebarsearchboxWrapper ${isExtended ? "" : "hidden"}`}
        >
          <img src={Search} alt="" className="searchLogo" />
          {isExtended && (
            <input
              type="text"
              className="sidebarsearchbox"
              placeholder="Search"
            />
          )}
        </div> */}
      </div>
      <button className="extendbtn" onClick={toggleSidebar}>
        <img src={ExtendBtn} alt="" className="extendbtnImg" />
      </button>
      <div className="sidebarContent">
        <div className="sidebarRow">
          <div className={`ctgText ${isExtended ? "" : "hidden"}`}>MAIN</div>
        </div>
        <div className="sidebarRow" onClick={() => handleSidebarTextClick("홈")}>
          <img src={Home} alt="" className="sidebarIcon" />
          <div className={`sidebarText ${isExtended ? "" : "hidden"}`}>홈</div>
        </div>
        <div className="sidebarRow" onClick={() => handleSidebarTextClick("식당 조회")}>
          <img src={Restaurant} alt="" className="sidebarIcon rest" />
          <div className={`sidebarText ${isExtended ? "" : "hidden"}`}>
            식당 조회
          </div>
        </div>
        <div className="sidebarRow" onClick={() => handleSidebarTextClick("1:1 문의")}>
          <img src={Chat} alt="" className="sidebarIcon" />
          <div className={`sidebarText ${isExtended ? "" : "hidden"}`}>
            1:1 문의
          </div>
        </div>

        <div className="userContent">
          <div className="sidebarRow">
            <div className={`ctgText ${isExtended ? "" : "hidden"}`}>USER</div>
          </div>
          {isLoggedIn ? (
            <>
              <div
                className="sidebarRow"
                onClick={() => handleSidebarTextClick("마이페이지")}
              >
                <img src={Login} alt="" className="sidebarIcon" />
                <div className={`sidebarText ${isExtended ? "" : "hidden"}`}>
                  마이페이지
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
            </>
          ) : (
            <>
              <div className="sidebarRow">
                <img src={Login} alt="" className="sidebarIcon" />
                <div
                  className={`sidebarText ${isExtended ? "" : "hidden"}`}
                  onClick={loginShow}
                >
                  로그인
                </div>
              </div>
              <div className="sidebarRow">
                <img src={Login} alt="" className="sidebarIcon" />
                <div
                  className={`sidebarText ${isExtended ? "" : "hidden"}`}
                  onClick={() => {
                    naversigninShow();
                  }}
                >
                  회원가입
                </div>
              </div>
            </>
          )}
        </div>
        <button
          className={`sidebaraskButton ${isExtended ? "" : "hidden"}`}
          onClick={handleOpenSelectReceiverModal}
        >
          관리자 문의
        </button>
      </div>
      <SelectReceiverModal
        isOpen={isModalOpen}
        onClose={handleCloseSelectReceiverModal}
        receiverId={receiverId}
        senderId={senderId}
      />
    </div>
  );
}

export default SideBar;
