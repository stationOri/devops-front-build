import "../../css/components/adminn/AdminRestReservation.css";
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination";
import Search from "../../assets/images/sidebar/search.png";
import UserInfoModal from "../Modal/UserInfoModal";

function AdminUserList() {
  const [readyRest, setReadyRest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [infoshow, setInfoShow] = useState(false);
  const [selectedRest, setSelectedRest] = useState(null);
  const [statusFilters, setStatusFilters] = useState({
    활동회원: true,
    탈퇴회원: false,
  });

  const openInfoModal = (user) => {
    setSelectedRest(user);
    setInfoShow(true);
  };

  const closeInfoModal = () => {
    setInfoShow(false);
  };

  const getRestData = async () => {
    try {
      const response = await fetch("${process.env.REACT_APP_API_URI}/api/user");

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const json = await response.json();
      console.log("Fetched data:", json);
      setReadyRest(json || []);
      setFilteredItems(json || []); // 데이터를 필터링하기 전에 설정합니다.
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, statusFilters, readyRest]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilters({
      ...statusFilters,
      [e.target.value]: e.target.checked,
    });
    setCurrentPage(1);
  };

  const filterItems = () => {
    let filtered = readyRest;

    filtered = filtered.filter((item) => {
      if (
        (statusFilters.활동회원 && !item.banned) ||
        (statusFilters.탈퇴회원 && item.banned)
      ) {
        return true;
      }
      return false;
    });

    filtered = filtered.filter((item) =>
      item.userId.toString().includes(searchTerm)
    );

    setFilteredItems(filtered);
    setCurrentPage(1);
  };

  const fillEmptyItems = (array, itemsPerPage) => {
    const filledArray = [...array];
    const remainder = filledArray.length % itemsPerPage;
    if (remainder !== 0) {
      const itemsToAdd = itemsPerPage - remainder;
      for (let i = 0; i < itemsToAdd; i++) {
        filledArray.push({
          userId: filledArray.length + 1,
          userName: "빈열",
          userNickname: "",
          userPhone: "",
          userEmail: "",
          blocked: false,
          banned: false,
        });
      }
    }
    return filledArray;
  };

  const filledItems = fillEmptyItems(filteredItems, itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filledItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="restacceptrootWrapper">
      <div className="restAcceptbfWrapper">
        <div className="resfirstrowWrapper">
          <div className="headerfortext">
            <div className="restacceptTitle">전체 사용자 목록</div>
            <p className="restacceptP">전체 사용자 목록이 보여집니다.</p>
          </div>
        </div>
        <div className="ressecondrowWRapper">
          <div className="rescheckboxWrapper">
            <div>활동 상태 :</div>
            <label>
              <input
                type="checkbox"
                name="status"
                value="활동회원"
                checked={statusFilters.활동회원}
                onChange={handleStatusChange}
              />
              활동회원
            </label>
            <label>
              <input
                type="checkbox"
                name="status"
                value="탈퇴회원"
                checked={statusFilters.탈퇴회원}
                onChange={handleStatusChange}
              />
              탈퇴회원
            </label>
          </div>
          <div className="headerforsearch">
            <img src={Search} alt="" className="searchimginrestsearch" />
            <input
              type="text"
              className="restsearchinput"
              placeholder="사용자 ID 검색"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      <hr />
      {!loading && (
        <div className="restResTableWrapper">
          <div className="restresTableWrapper">
            <table className="tableforadminres">
              <thead>
                <tr className="cnforbgc">
                  <th scope="col">ID</th>
                  <th scope="col">이름</th>
                  <th scope="col">전화번호</th>
                  <th scope="col">이메일</th>
                  <th scope="col">정지</th>
                  <th scope="col">탈퇴</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((user, index) => (
                  <tr key={index}>
                    {user.userName === "빈열" ? (
                      <td></td>
                    ) : (
                      <td>{user.userId}</td>
                    )}
                    {user.userName === "빈열" ? (
                      <td></td>
                    ) : (
                      <td onClick={() => openInfoModal(user)} style={{cursor:"pointer"}}>{user.userName}</td>
                    )}
                    <td>{user.userPhone}</td>
                    <td>{user.userEmail}</td>
                    {user.userName !== "빈열" ? (
                      <td>{user.blocked ? "O" : "X"}</td>
                    ) : (
                      <td></td>
                    )}
                    {user.userName !== "빈열" ? (
                      <td>{user.banned ? "O" : "X"}</td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Pagination
        totalItems={filteredItems.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {infoshow && selectedRest && (
        <UserInfoModal
          InfoClose={closeInfoModal}
          infoshow={infoshow}
          user={selectedRest}
        />
      )}
    </div>
  );
}

export default AdminUserList;
