import React, { useState, useEffect } from "react";
import "../../css/components/adminn/AdminRestAfterAccept.css";
import Pagination from "../Pagination";
import RestInfoModal from "../Modal/RestInfoModal";
import Search from "../../assets/images/sidebar/search.png";
import Loading from "../Loading";

function AdminRestAfterAccept() {
  const [readyRest, setReadyRest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRest, setSelectedRest] = useState(null); // 선택된 매장 정보
  const [infoshow, setInfoShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 20;

  // 데이터 가져오기 함수
  const getRestData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://waitmate.shop/api/restaurants/afterAccept/${currentPage}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const json = await response.json();
      console.log("Fetched data:", json);
      setReadyRest(json.content || []);
      setTotalElements(json.totalElements || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 페이지가 변경될 때 데이터 새로 가져오기
  useEffect(() => {
    getRestData();
  }, [currentPage]);

  // 검색 필터 적용
  const filteredItems = readyRest.filter((item) =>
    item.rest_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 정보 모달 열기
  const openInfoModal = (rest) => {
    setSelectedRest(rest);
    setInfoShow(true);
  };

  // 정보 모달 닫기
  const closeInfoModal = () => {
    setInfoShow(false);
  };

  return (
    <div className="restacceptrootWrapper">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="restAcceptexWrapper">
            <div className="headerfortext">
              <div className="restacceptTitle">승인 완료 매장 목록</div>
              <p className="restacceptP">가게 이름 클릭 시 가게 정보 표시</p>
            </div>
            <div className="headerforsearch">
              <img src={Search} alt="" className="searchimginrestsearch" />
              <input
                type="text"
                className="restsearchinput"
                placeholder="매장명 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <hr />
          <div className="restafteracceptTableWrapper">
            <div className="restacceptColumn">
              {filteredItems.filter((_, index) => index % 2 === 0).map((rest) => (
                <div className="restafteracceptRowWrapper" key={rest.rest_id}>
                  <div className="restaccept">{rest.rest_name}</div>
                  <button
                    className="restafteracceptbutton"
                    onClick={() => openInfoModal(rest)}
                  >
                    매장 확인
                  </button>
                </div>
              ))}
            </div>
            <div className="restacceptColumn">
              {filteredItems.filter((_, index) => index % 2 !== 0).map((rest) => (
                <div className="restafteracceptRowWrapper" key={rest.rest_id}>
                  <div className="restaccept">{rest.rest_name}</div>
                  <button
                    className="restafteracceptbutton"
                    onClick={() => openInfoModal(rest)}
                  >
                    매장 확인
                  </button>
                </div>
              ))}
            </div>
          </div>
          <Pagination
            totalItems={totalElements}  // 전체 항목 수 전달
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {infoshow && selectedRest && (
        <RestInfoModal
          InfoClose={closeInfoModal}
          infoshow={infoshow}
          rest_id={selectedRest.rest_id}
          rest_name={selectedRest.rest_name}
          rest_num={selectedRest.rest_num}
          rest_owner={selectedRest.rest_owner}
          rest_phone={selectedRest.rest_phone}
          rest_data={selectedRest.rest_data}
          join_date={selectedRest.join_date}
          quit_date={selectedRest.quit_date}
          is_blocked={selectedRest.is_blocked}
          rest_isopen={selectedRest.rest_isopen}
          rest_status={selectedRest.rest_status}
        />
      )}
    </div>
  );
}

export default AdminRestAfterAccept;