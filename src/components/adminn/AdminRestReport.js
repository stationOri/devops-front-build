import "../../css/components/adminn/AdminRestReservation.css";
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination";
import Search from "../../assets/images/sidebar/search.png";
import ReportAcceptModal from "../Modal/ReportAcceptModal";

function AdminRestReport() {
  const [readyRest, setReadyRest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [reportacceptshow, setReportAcceptShow] = useState(false);
  const [statusFilters, setStatusFilters] = useState({
    처리대기: true,
    승인: false,
    반려: false,
  });
  const [selectedReservation, setSelectedReservation] = useState(null);

  const ReportAcceptClose = () => setReportAcceptShow(false);
  const ReportAcceptShow = () => setReportAcceptShow(true);

  const getRestData = async () => {
    try {
      const response = await fetch("http://localhost:8080/rest/report");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
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
        (statusFilters.처리대기 && item.reportStatus === "처리대기") ||
        (statusFilters.승인 && item.reportStatus === "승인") ||
        (statusFilters.반려 && item.reportStatus === "반려")
      ) {
        return true;
      }
      return false;
    });

    

    filtered = filtered.filter((item) =>
      item.id.toString().includes(searchTerm)
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
          restReportId: filledArray.length + 1,
          restName: "김밥 천국",
          reportDate: "2024-06-01",
          reportContent: "",
          reporterId: "",
          adminId: "",
          reportStatus: "빈열",
        });
      }
    }
    return filledArray;
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    ReportAcceptShow();
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
            <div className="restacceptTitle">매장 신고 목록</div>
            <p className="restacceptP">
              사용자의 매장 신고 내역입니다. 신고 내용을 누르면 전체 내용이
              보여집니다.
            </p>
          </div>
        </div>
        <div className="ressecondrowWRapper">
          <div className="rescheckboxWrapper">
            <div>처리 상태 :</div>
            <label>
              <input
                type="checkbox"
                name="status"
                value="처리대기"
                checked={statusFilters.처리대기}
                onChange={handleStatusChange}
              />
              처리대기
            </label>
            <label>
              <input
                type="checkbox"
                name="status"
                value="승인"
                checked={statusFilters.승인}
                onChange={handleStatusChange}
              />
              승인
            </label>
            <label>
              <input
                type="checkbox"
                name="status"
                value="반려"
                checked={statusFilters.반려}
                onChange={handleStatusChange}
              />
              반려
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
                  <th scope="col">매장명(신고 날짜)</th>
                  <th scope="col">신고 내용</th>
                  <th scope="col">신고자 ID</th>
                  <th scope="col">처리</th>
                  <th scope="col">관리자 ID</th>
                </tr>
              </thead>
              {currentItems.length === 0 ? (
                <td colSpan={5}
                style={{textAlign:"center", fontSize:"15px"}}>표시할 항목이 없습니다.</td>
              ) : (
                <tbody>
                  {currentItems.map((rest, index) => (
                    <tr key={index}>
                      {rest.status !== "빈열" ? (
                        <td>
                          {rest.restName}({rest.reportDate})
                        </td>
                      ) : (
                        <td></td>
                      )}
                      <td>{rest.reportContent}</td>
                      <td>{rest.reporterId}</td>
                      {rest.reportStatus !== "빈열" ? (
                        <td style={{width:"65px"}}>
                          <p>{rest.reportStatus}</p>
                          {rest.reportStatus === "처리대기" && (
                            <button
                              className="adminrescancel"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReservationClick(rest);
                              }}
                            >
                              신고처리
                            </button>
                          )}
                        </td>
                      ) : (
                        <td></td>
                      )}
                      {rest.adminId ? (
                        <td className="cnforbgc">{rest.adminId}</td>
                      ) : (
                        <td className="cnforbgc"></td>
                      )}
                    </tr>
                  ))}
                </tbody>
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
      <ReportAcceptModal
        reportacceptshow={reportacceptshow}
        ReportAcceptClose={ReportAcceptClose}
      />
    </div>
  );
}

export default AdminRestReport;
