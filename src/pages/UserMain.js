import React, { useState } from "react";
import HeaderOrange from "../components/HeaderOrange";
import SideBar from "../components/user/SideBar";
import Main from "../components/user/Main";
import Restaurants from "../components/user/Restaurants";
import RestDetail from "../components/user/RestDetail";
import Reservation from "../components/user/Reservation";
import UserChat from "../components/chatt/UserChat";
import Mypage from "../components/user/Mypage";
import "../css/pages/RestMain.css";

function UserMain() {
  const [selectedMenu, setSelectedMenu] = useState("홈");
  const [isExtended, setIsExtended] = useState(true);
  const [userId, setUserId] = useState("");
  const [selectedRestId, setSelectedRestId] = useState(null);

  const handleMenuClick = (menuName) => {
    setSelectedMenu(menuName);
  };

  const toggleSidebar = () => {
    setIsExtended(!isExtended);
  };

  const handleCardClick = (restId) => {
    setSelectedRestId(restId);
    setSelectedMenu("식당 상세");
  };

  const handleMoveToReservation = (restId) => {
    setSelectedRestId(restId);
    setSelectedMenu("예약");
  };


  return (
    <div className="mainWrapper">
      <SideBar
        className="mainSidebar"
        onMenuClick={handleMenuClick}
        isExtended={isExtended}
        toggleSidebar={toggleSidebar}
        setUserId={setUserId}
      />
      <div className="maincontentsWrapper">
        <div className={`behindsidebar ${isExtended ? "" : "collapsed"}`} />
        <div
          className={`innercontentsWrapper ${isExtended ? "" : "collapsed"}`}
        >
          <HeaderOrange />
          <div className="restmainrealcontents">
            {selectedMenu === "홈" && (
              <Main onMenuEditClick={handleMenuClick} userId={userId} onCardClick={handleCardClick}/>
            )}
            {selectedMenu === "식당 조회" && (
              <Restaurants
                onMenuEditClick={handleMenuClick}
                onCardClick={handleCardClick}
                userId={userId}
              />
            )}
            {selectedMenu === "식당 상세" && (
              <RestDetail
                onMenuEditClick={handleMenuClick}
                userId={userId}
                restId={selectedRestId}
                moveToReservation={handleMoveToReservation}
              />
            )}
            {selectedMenu === "예약" && (
              <Reservation
                onMenuEditClick={handleMenuClick}
                userId={userId}
                restId={selectedRestId}
                setSelectedMenu={setSelectedMenu}
              />
            )}
            {selectedMenu === "1:1 문의" && (
              <UserChat onMenuEditClick={handleMenuClick} userId={userId} />
            )}
            {selectedMenu === "마이페이지" && (
              <Mypage
                onMenuEditClick={handleMenuClick}
                onCardClick={handleCardClick}
                userId={userId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserMain;
