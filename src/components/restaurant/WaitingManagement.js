import Now from "../../assets/images/Restaurant/now.png";
import Waiting from "../../assets/images/Restaurant/waiting.png";
import "../../css/components/restaurant/WaitingManagement.css";
import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import Pagination from "../Pagination";

function WaitingManagement({ restId, onMenuClick }) {
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(false);
  const [upperText, setUpperText] = useState("");
  const [lowerText, setLowerText] = useState("");
  const [team, setTeam] = useState(0);
  const [people, setPeople] = useState(0);
  const itemsPerPage = 10;
  const [waitingList, setWaitingList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableOrder, setTableOrder] = useState([]);

  // 식당 웨이팅 상태 확인
  const getWait = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/info/revWait/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const text = await response.text();
      if (text === "A" || text === "C") {
        setWait(true);
      }
      console.log(wait + text);
    } catch (error) {
      console.error("Error revWait status:", error);
    }
  };

  // 웨이팅 상태 확인
  const getWaitStatus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/info/waitingstatus/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const text = await response.text();
      if (text === "A") {
        setUpperText("현재 웨이팅 접수 중지중입니다.");
        setLowerText("웨이팅 접수를 시작해주세요.");
      } else if (text === "B") {
        setUpperText("현재 웨이팅 접수 종료중입니다.");
        setLowerText("웨이팅 접수를 시작해주세요.");
      } else if (text === "C") {
        setUpperText("현재 웨이팅 접수 중입니다.");
        setLowerText("웨이팅 접수 시작이 불가능합니다.");
      }
    } catch (error) {
      console.error("Error revWait status:", error);
    }
  };

  // 웨이팅 리스트 가져오기
  const getWaitList = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/waiting/rest/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const json = await response.json();
      setWaitingList(json);
      updateCounts(json);
    } catch (error) {
      console.error("Error fetching wait list:", error);
    }
  };

  // 총 팀 수와 인원 수 업데이트 (IN_QUEUE 상태만 포함)
  const updateCounts = (list) => {
    let totalTeams = 0;
    let totalPeople = 0;
    list.forEach((wait) => {
      if (wait.waitingStatus === "IN_QUEUE") {
        totalTeams += 1;
        totalPeople += wait.waitingPpl;
      }
    });
    setTeam(totalTeams);
    setPeople(totalPeople);
  };

  // 웨이팅 상태 업데이트
  const updateWaitStatus = async (status) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/info/rest/${restId}/waitstatus/${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update status. Status code: ${response.status}. Response: ${errorText}`
        );
      }
      alert("변경 완료");
      await getWait();
      await getWaitStatus();
      await getWaitList();
    } catch (error) {
      console.error("Error updating wait status:", error);
    }
  };

  //사용자 웨이팅 상태 업데이트
  const updateuserWaitStatus = async (status, waitingId) => {
    try {
      console.log(
        `Updating wait status: ${status} for waitingId: ${waitingId}`
      );
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/waiting/${waitingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(status),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update status. Status code: ${response.status}. Response: ${errorText}`
        );
      }

      await getWait();
      await getWaitStatus();
      await getWaitList();
    } catch (error) {
      console.error("Error updating wait status:", error);
    }
  };

  // 웨이팅 접수 시작
  const handleStartWaiting = () => {
    updateWaitStatus("C");
  };

  // 웨이팅 접수 중지
  const handleStopWaiting = () => {
    updateWaitStatus("A");
  };

  // 웨이팅 접수 종료
  const handleEndWaiting = () => {
    updateWaitStatus("B");
  };

  // 빈 항목 채우기 (페이지네이션을 위해)
  const fillEmptyItems = (array, itemsPerPage) => {
    const filledArray = [...array];
    const remainder = filledArray.length % itemsPerPage;
    if (remainder !== 0) {
      const itemsToAdd = itemsPerPage - remainder;
      for (let i = 0; i < itemsToAdd; i++) {
        filledArray.push({
          waitingId: "",
          waitingNum: "",
          waitingPpl: "",
          userName: "",
          waitingStatus: "None",
        });
      }
    }
    return filledArray;
  };

  // 테이블 순번 업데이트
  const updateTableOrder = () => {
    const order = currentItems.map((item, index) => ({
      ...item,
      order: index + 1 + (currentPage - 1) * itemsPerPage,
    }));
    setTableOrder(order);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getWait(), getWaitStatus(), getWaitList()]);
      setLoading(false);
    };

    fetchData();
  }, [restId]);

  useEffect(() => {
    updateTableOrder();
  }, [waitingList, currentPage]);

  // 페이지네이션 처리
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fillEmptyItems(waitingList, itemsPerPage).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const renderStatusContent = (status, waitingId) => {
    switch (status) {
      case "IN_QUEUE":
        return (
          <td className="status-in-queue">
            <button
              className="requestBtnOrange"
              onClick={() =>
                updateuserWaitStatus("WALKIN_REQUESTED", waitingId)
              }
            >
              입장 요청
            </button>
          </td>
        );
      case "WALKIN_REQUESTED":
        return (
          <td className="status-walkin-requested">
            입장요청완료
            <button
              className="requestBtnOrange"
              onClick={() => updateuserWaitStatus("WALKIN", waitingId)}
            >
              입장 완료
            </button>
            <button
              className="requestBtnOrange"
              onClick={() => updateuserWaitStatus("NOSHOW", waitingId)}
            >
              노쇼
            </button>
          </td>
        );
      case "WALKIN":
        return <td className="status-walkin">입장 완료</td>;
      case "QUEUE_CANCELED":
        return <td className="status-queue-canceled">대기 취소</td>;
      case "NOSHOW":
        return <td className="status-noshow">노쇼</td>;
      default:
        return <td></td>;
    }
  };

  const gotoRestInfo = () => {
    onMenuClick("계정 정보");
  };

  return (
    <div className="WrapperWithoutBorder">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="UpperBoxRest">
            <div className="rest-text">
              <img src={Now} alt="" className="rest-text-logo" />
              <p className="rest-bold-text">Now</p>
            </div>
            <div className="rest-content-box">
              <hr className="innerHrLine" />
              <div className="betweenLineContent">
                <div className="waitinExText">
                  현재까지 웨이팅
                  <div>
                    <span className="spanforOrange">{team}</span> 팀 /{" "}
                    <span className="spanforOrange">{people}</span> 명
                  </div>
                </div>
                {wait && (
                  <div className="rest-right-box">
                    <div className="rest-button-box">
                      <button
                        className="btnforBlackBorder"
                        onClick={handleStartWaiting}
                      >
                        웨이팅 접수 시작
                      </button>
                      <button
                        className="btnforOrange"
                        onClick={handleStopWaiting}
                      >
                        웨이팅 접수 중지
                      </button>
                      <button
                        className="btnforOrange"
                        onClick={handleEndWaiting}
                      >
                        웨이팅 접수 종료
                      </button>
                    </div>
                    <div className="boxforhinttext">
                      {upperText}
                      <div className="spanforRed">{lowerText}</div>
                    </div>
                  </div>
                )}
              </div>
              <hr className="innerHrLine" />
            </div>
          </div>
          <div className="LowerBoxRest">
            <div className="rest-text">
              <img src={Waiting} alt="" className="rest-text-logo" />
              <p className="rest-bold-text">Waiting List</p>
            </div>
            <table className="waitingTable">
              <thead>
                <tr className="fortablebgc">
                  <td>순번</td>
                  <td>이름</td>
                  <td>인원</td>
                  <td>웨이팅 번호</td>
                  <td style={{ width: "300px" }}>상태변경</td>
                </tr>
              </thead>
              <tbody>
                {wait ? (
                  currentItems.length ? (
                    currentItems.map((wait, index) => {
                      const tableItem = tableOrder.find(
                        (item) => item.waitingId === wait.waitingId
                      );

                      const uniqueKey = wait.waitingId
                        ? wait.waitingId
                        : `${index}-${new Date().getTime()}`;

                      return (
                        <tr key={uniqueKey}>
                          <td>
                            {wait.waitingStatus !== "None" && tableItem?.order}
                          </td>
                          <td>{wait.userName}</td>
                          <td>{wait.waitingPpl}</td>
                          <td>{wait.waitingId}</td>
                          {renderStatusContent(
                            wait.waitingStatus,
                            wait.waitingId
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", paddingTop: "20px" }}
                      >
                        페이지에 표시할 항목이 없습니다.
                      </td>
                    </tr>
                  )
                ) : (
                  <>
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", paddingTop: "20px" }}
                      >
                        원격 줄서기 기능을 사용하고 않고 있습니다.
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          paddingBottom: "20px",
                          backgroundColor: "#fff",
                        }}
                      >
                        해당 기능을 사용하려면 가게 정보 수정 화면에서 원격
                        줄서기 기능을 활성화 해주세요.
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        <button onClick={gotoRestInfo}>
                          가게 정보 수정하러 가기
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            totalItems={waitingList.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            activeColor="#FF8A00"
          />
        </>
      )}
    </div>
  );
}

export default WaitingManagement;
