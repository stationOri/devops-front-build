import React, { useState } from "react";
import "../../css/components/Modal/RestAcceptModal.css";
import RestRejectModal from "./RestRejectModal";

function RestAcceptModal({
  acceptshow,
  AcceptClose,
  rest_id,
  rest_name,
  rest_num,
  rest_owner,
  rest_phone,
  rest_data,
  join_date,
  onUpdateStatus,
  reloadData, // 부모 컴포넌트에서 전달된 함수
  setEditSuccess
}) {
  const [rejectshow, setRejectShow] = useState(false);

  const RejectClose = () => setRejectShow(false);
  const RejectShow = () => setRejectShow(true);

  const handleAcceptRest = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URI}/api/restaurants/status/${rest_id}`;
      const requestBody = { status: "B" };

      console.log("다음과 같이 레스토랑 상태를 업데이트합니다:", url, requestBody);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('레스토랑 상태 업데이트 실패');
      }

      console.log('Updated status:', rest_id, "B");

      onUpdateStatus(rest_id, "B");
      setEditSuccess(true);
      reloadData();
      AcceptClose();
    } catch (error) {
      console.error('레스토랑 상태 업데이트 오류:', error);
      AcceptClose();
    }
  };

  const handleRejectRest = () => {
    AcceptClose();
    RejectShow();
  };

  const handleShowClick = () => {
    window.open(rest_data, "_blank");
  };

  return (
    <div>
      <div
        id={acceptshow ? "signinbackgroundon" : "signinbackgroundoff"}
        onClick={(e) => {
          if (
            e.target.id === "signinbackgroundon" ||
            e.target.id === "signinbackgroundoff"
          ) {
            AcceptClose();
          }
        }}
      >
        <div
          className={`acceptModal ${acceptshow ? "signinshow" : "signinhide"}`}
        >
          <div className="acceptmodalcontentswrapper">
            <div className="acceptModalHeader">
              <div className="acceptboldText">신규 매장 승인</div>
              <button className="acceptclosebtn" onClick={AcceptClose}>
                X
              </button>
            </div>
            <div className="restacceptModalContent">
              <div className="firstacceptrow">
                <div className="accepthintText">매장 이름</div>
                <input
                  type="text"
                  className="input1box"
                  value={rest_name}
                  readOnly
                />
              </div>
              <div className="secondaccpetrow">
                <div className="accepthintText">사업자 등록번호</div>
                <input
                  type="text"
                  className="input1box"
                  value={rest_num}
                  readOnly
                />
              </div>
              <div className="thirdaccpetrow">
                <div className="foralign">
                  <div className="accepthintText">점주 이름</div>
                  <input
                    type="text"
                    className="input2box"
                    value={rest_owner}
                    readOnly
                  />
                </div>
                <div className="foralign">
                  <div className="accepthintText">점주 전화번호</div>
                  <input
                    type="text"
                    className="input2box"
                    value={rest_phone}
                    readOnly
                  />
                </div>
              </div>
              <div className="fourthaccpetrow">
                <div className="foralign">
                  <div className="accepthintText">사업자 등록증</div>
                  <div className="forspacing">
                    <input
                      type="text"
                      className="input2boxwithbtn"
                      value={rest_num}
                      readOnly
                    />
                    <button className="acceptshowbtn" onClick={handleShowClick}>show</button>
                  </div>
                </div>
                <div className="foralign">
                  <div className="accepthintText">승인 요청일</div>
                  <input
                    type="text"
                    className="input2box"
                    value={join_date}
                    readOnly
                  />
                </div>
              </div>
            </div>
            <div className="acceptModalButton">
              <button className="acceptModalAccept" onClick={handleAcceptRest}>
                승인
              </button>
              <button className="acceptModalReject" onClick={handleRejectRest}>
                거절
              </button>
            </div>
          </div>
        </div>
      </div>
      {rejectshow && (
        <RestRejectModal
          rest_id={rest_id}
          rejectshow={rejectshow}
          RejectClose={RejectClose}
          reloadData={reloadData}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
}

export default RestAcceptModal;
