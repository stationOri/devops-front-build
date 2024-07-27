import "../../css/components/adminn/AdminRestAccept.css";
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination"; // 페이지네이션 컴포넌트 임포트
import RestAcceptModal from "../Modal/RestAcceptModal";
import Loading from "../Loading";

function AdminRestAccept() {
  const [readyRest, setReadyRest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [acceptshow, setAcceptShow] = useState(false);
  const itemsPerPage = 10;
  const [totalElements, setTotalElements] = useState(0);
  const [selectedRest, setSelectedRest] = useState(null);
  const [editSuccess, setEditSuccess] = useState(false);

  const AcceptClose = () => setAcceptShow(false);
  const AcceptShow = (rest) => {
    setSelectedRest(rest);
    setAcceptShow(true);
  };

  const getRestData = async () => {
    console.log('Fetching data...');
    setLoading(true);
    try {
      const response = await fetch(`https://waitmate.shop/api/restaurants/beforeAccept/${currentPage}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const json = await response.json();
      setReadyRest(json.content || []); 
      setTotalElements(json.totalElements || 0);
      console.log('Data fetched successfully:', json);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestData();
  }, [currentPage]); 

  useEffect(() => {
    console.log("editSuccess 상태가 변경되었습니다:", editSuccess);
    if (editSuccess) {
      getRestData();
      setEditSuccess(false);
    }
  }, [editSuccess]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUpdateStatus = (id, newStatus) => {
    console.log("Updating status for ID:", id, "to:", newStatus);
    const updatedRests = readyRest.map((rest) =>
      rest.restId === id ? { ...rest, status: newStatus } : rest
    );
    setReadyRest(updatedRests);
  };

  return (
    <div className="restacceptrootWrapper">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="restAcceptbfWrapper">
            <div className="restacceptTitle">승인 대기 매장 목록</div>
            <p className="restacceptP">가게 이름 클릭 시 가게 등록 정보 표시</p>
          </div>
          <hr />
          <div className="restacceptTableWrapper">
            {readyRest.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "200px",
                }}
              >
                승인을 대기중인 매장이 없습니다.
              </div>
            ) : (
              <>
                {readyRest.map((rest) => (
                  <div className="restacceptRowWrapper" key={rest.restId}>
                    <div className="restaccept">{rest.rest_name}</div>
                    <button
                      className="restacceptbutton"
                      rest_id={rest.restId}
                      onClick={() => AcceptShow(rest)}
                    >
                      승인
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
          <Pagination
            totalItems={totalElements}  // 전체 항목 수 전달
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
      {selectedRest && (
        <RestAcceptModal
          acceptshow={acceptshow}
          AcceptClose={AcceptClose}
          rest_id={selectedRest.restId}
          rest_name={selectedRest.rest_name}
          rest_num={selectedRest.rest_num}
          rest_owner={selectedRest.rest_owner}
          rest_phone={selectedRest.rest_phone}
          rest_data={selectedRest.rest_data}
          join_date={selectedRest.join_date}
          onUpdateStatus={handleUpdateStatus}
          reloadData={getRestData} // 새로운 함수 전달
          setEditSuccess={setEditSuccess}
        />
      )}
    </div>
  );
}

export default AdminRestAccept;