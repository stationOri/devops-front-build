import "../../css/components/Modal/RestInfoModal.css";

function RestInfoModal({
  InfoClose,
  infoshow,
  rest_id,
  rest_name,
  rest_num,
  rest_owner,
  rest_phone,
  rest_data,
  join_date,
  quit_date,
  is_blocked,
  rest_isopen,
  rest_status
}) {

  const blockedStatus = is_blocked ? 'yes' : 'no';
  const openStatus = rest_isopen ? 'yes' : 'no';

  const handleShowClick = () => {
    window.open(rest_data, "_blank");
  };

  return (
    <div>
      <div
        id={infoshow ? "signinbackgroundon" : "signinbackgroundoff"}
        onClick={(e) => {
          if (
            e.target.id === "signinbackgroundon" ||
            e.target.id === "signinbackgroundoff"
          ) {
            InfoClose();
          }
        }}
      >
        <div className={`infoModal ${infoshow ? "signinshow" : "signinhide"}`}>
          <div className="acceptmodalcontentswrapper">
            <div className="acceptModalHeader">
              <div className="acceptboldText">사용자 정보 확인</div>
              <button className="acceptclosebtn" onClick={InfoClose}>
                X
              </button>
            </div>
            <div className="restacceptModalContent">
              <div className="zeroacceptrow">
                <div className="accepthintText">식당 id</div>
                <input
                  type="text"
                  className="input1boxzero"
                  value={rest_id}
                  readOnly
                />
              </div>
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
                  <div className="accepthintText">가입일</div>
                  <input
                    type="text"
                    className="input2box"
                    value={join_date}
                    readOnly
                  />
                </div>
              </div>
              <div className="fifthaccpetrow">
                <div className="foralign">
                  <div className="accepthintText">계정 금지 유무</div>
                  <input className="input2box" value={blockedStatus} readOnly/>
                </div>
                <div className="foralign">
                  <div className="accepthintText">탈퇴일</div>
                  <input
                    type="text"
                    className="input2box"
                    value={quit_date}
                    readOnly
                  />
                </div>
              </div>
              <div className="sixthaccpetrow">
                <div className="foralign">
                  <div className="accepthintText">식당 상태</div>
                  <input
                    type="text"
                    className="input2box"
                    value={rest_status}
                    readOnly
                  />
                </div>
                <div className="foralign">
                  <div className="accepthintText">예약 오픈 여부</div>
                  <input className="input2box" value={openStatus} readOnly/>
                </div>
              </div>
            </div>
            <div className="acceptModalButton">
              <button className="infoModalcheck" onClick={InfoClose}>
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestInfoModal;
