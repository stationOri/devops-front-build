import React, { useState, useCallback } from "react";
import HeaderOrange from "../components/HeaderOrange";
import SideBarRest from "../components/restaurant/SideBarRest";
import MenuManagement from "../components/restaurant/MenuManagement";
import Reservation from "../components/restaurant/Reservation";
import WaitingManagement from "../components/restaurant/WaitingManagement";
import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import RestaurantInfoEdit from "../components/restaurant/RestaurantInfoEdit";
import AccountInfo from "../components/restaurant/AccountInfo";
import RestChat from "../components/chatt/RestChat";
// import FileUploadTest from "../components/FileUploadTest";
import "../css/pages/RestMain.css";

function RestMain() {
  const [selectedMenu, setSelectedMenu] = useState("식당정보");
  const [isExtended, setIsExtended] = useState(true);
  const [selectedRestId, setSelectedRestId] = useState(null);

  const handleMenuClick = (menuName) => {
    setSelectedMenu(menuName);
  };

  const toggleSidebar = () => {
    setIsExtended(!isExtended);
  };

  const handleInfoEditClick = (id) => {
    console.log("식당 정보 수정 버튼 클릭됨, ID:", id);
    setSelectedRestId(id);
    setSelectedMenu("계정 정보");
  };

  const handleRestIdChange = useCallback((id) => {
    console.log("식당 ID 변경됨, ID:", id);
    setSelectedRestId(id);
  }, []);

  return (
    <div className="mainWrapper">
      <SideBarRest
        className="mainSidebar"
        onMenuClick={handleMenuClick}
        isExtended={isExtended}
        toggleSidebar={toggleSidebar}
        onRestIdChange={handleRestIdChange}
      />
      <div className="maincontentsWrapper">
        <div className={`behindsidebar ${isExtended ? "" : "collapsed"}`} />
        <div
          className={`innercontentsWrapper ${isExtended ? "" : "collapsed"}`}
        >
          <HeaderOrange />
          <div className="restmainrealcontents">
            {selectedMenu === "식당정보" && selectedRestId && (
              <RestaurantInfo
                onMenuEditClick={handleMenuClick}
                onInfoEditClick={handleInfoEditClick}
                restId={selectedRestId}
              />
              // <FileUploadTest />
            )}
            {selectedMenu === "메뉴 관리" && selectedRestId && (
              <MenuManagement restId={selectedRestId} />
            )}
            {selectedMenu === "예약" && <Reservation restId={selectedRestId} onMenuClick={handleMenuClick}/>}
            {selectedMenu === "웨이팅 관리" && <WaitingManagement restId={selectedRestId} onMenuClick={handleMenuClick}/>}
            {selectedMenu === "1:1 문의" && <RestChat restId={selectedRestId}/>}
            {selectedMenu === "계정 정보" && <AccountInfo restId={selectedRestId}/>}
            {selectedMenu === "로그아웃" && <Logout />}
          </div>
        </div>
      </div>
    </div>
  );
}



function Logout() {
  return <div>로그아웃 페이지입니다.</div>;
}

export default RestMain;