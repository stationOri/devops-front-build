import "../../css/components/adminn/AdminRestReservation.css";
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination";
import Search from "../../assets/images/sidebar/search.png";
import AdminResCancelModal from "../Modal/AdminResCancelModal";

function AdminRestReservation() {
  const [readyRest, setReadyRest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [admincancelshow, setAdminCancelShow] = useState(false);
  const [statusFilters, setStatusFilters] = useState({
    예약대기: true,
    예약취소: true,
    예약승인: true,
    방문완료: true,
  });
  const [selectedReservation, setSelectedReservation] = useState(null);

  const AdminCancelClose = () => setAdminCancelShow(false);
  const AdminCancelShow = () => setAdminCancelShow(true);

  // 데이터 불러오기
  const getRestData = async () => {
    try {
      const response = await fetch(
        "${process.env.REACT_APP_API_URI}/api/reservations/admin"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      console.log(response);
      console.log(response.data);
      const json = await response.json();
      console.log("Fetched data:", json);
      setReadyRest(json || []);
      setFilteredItems([]);
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
    setCurrentPage(1); // 필터가 변경되면 현재 페이지를 1 페이지로 설정
  };

  const filterItems = () => {
    let filtered = readyRest;

    filtered = filtered.filter((item) => {
      if (
        (statusFilters.예약대기 && item.status === "예약대기") ||
        (statusFilters.예약취소 && item.status === "예약취소") ||
        (statusFilters.예약승인 && item.status === "예약승인") ||
        (statusFilters.방문완료 && item.status === "방문")
      ) {
        return true;
      }
      return false;
    });

    filtered = filtered.filter((item) =>
      item.rest_id.toString().includes(searchTerm)
    );

    setFilteredItems(filtered);
    setCurrentPage(1); // 필터가 적용되면 현재 페이지를 1 페이지로 설정
  };

  const fillEmptyItems = (array, itemsPerPage) => {
    const filledArray = [...array];
    const remainder = filledArray.length % itemsPerPage;
    if (remainder !== 0) {
      const itemsToAdd = itemsPerPage - remainder;
      for (let i = 0; i < itemsToAdd; i++) {
        filledArray.push({
          id: filledArray.length + 1,
          rest_name: "",
          rest_id: "",
          user_id: "",
          res_num: "",
          res_datetime: "",
          req_datetime: "",
          status: "빈열",
        });
      }
    }
    return filledArray;
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    AdminCancelShow(); // 모달을 열어 선택된 예약 정보를 보여줄 수 있도록 함
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
            <div className="restacceptTitle">예약 목록</div>
            <p className="restacceptP">예약의 전체 목록이 보여집니다.</p>
          </div>
        </div>
        <div className="ressecondrowWRapper">
          <div className="rescheckboxWrapper">
            <div>예약 상태 :</div>
            <label>
              <input
                type="checkbox"
                name="status"
                value="예약대기"
                checked={statusFilters.예약대기}
                onChange={handleStatusChange}
              />
              예약대기
            </label>
            <label>
              <input
                type="checkbox"
                name="status"
                value="예약취소"
                checked={statusFilters.예약취소}
                onChange={handleStatusChange}
              />
              예약취소
            </label>
            <label>
              <input
                type="checkbox"
                name="status"
                value="예약승인"
                checked={statusFilters.예약승인}
                onChange={handleStatusChange}
              />
              예약승인
            </label>
            <label>
              <input
                type="checkbox"
                name="status"
                value="방문완료"
                checked={statusFilters.방문완료}
                onChange={handleStatusChange}
              />
              방문완료
            </label>
          </div>
          <div className="headerforsearch">
            <img src={Search} alt="" className="searchimginrestsearch" />
            <input
              type="text"
              className="restsearchinput"
              placeholder="매장 ID 검색"
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
                  <th scope="col">예약 ID</th>
                  <th scope="col">매장명(매장 ID)</th>
                  <th scope="col">사용자 ID</th>
                  <th scope="col">인원 수</th>
                  <th scope="col">예약 날짜</th>
                  <th scope="col">신청 날짜</th>
                  <th scope="col">예약 상태</th>
                  <th scope="col" style={{ width: "65px" }}></th>
                </tr>
              </thead>
              {currentItems.length === 0 ? (
                <td colSpan={8}
                style={{
                  textAlign:"center",
                  fontSize:"15px"
                }}
                >표시할 예약 내역이 없습니다.</td>
              ) : (
                <>
                  {currentItems.map((rest, index) => (
                    <tbody>
                      <tr key={index}>
                        {rest.status !== "빈열" ? (
                          <td>{rest.res_id}</td>
                        ) : (
                          <td></td>
                        )}
                        <td>
                          {rest.rest_name
                            ? `${rest.rest_name} (${rest.rest_id})`
                            : ""}
                        </td>
                        <td>{rest.user_id}</td>
                        <td>{rest.res_num}</td>
                        <td>{rest.res_datetime}</td>
                        <td>{rest.req_datetime}</td>
                        {rest.status !== "빈열" ? (
                          <td>{rest.status}</td>
                        ) : (
                          <td></td>
                        )}
                        <td className="cnforbgc" style={{ width: "65px" }}>
                          {rest.status === "예약승인" && (
                            <button
                              className="adminrescancel"
                              onClick={(e) => {
                                e.stopPropagation(); // 부모 클릭 방지
                                handleReservationClick(rest);
                              }}
                            >
                              예약취소
                            </button>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </>
              )}
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
      {selectedReservation && (
        <AdminResCancelModal
          reservation={selectedReservation}
          admincancelshow={admincancelshow}
          AdminCancelClose={AdminCancelClose}
        />
      )}
    </div>
  );
}

export default AdminRestReservation;
