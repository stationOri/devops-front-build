import "../../css/components/Modal/RestInfoModal.css";

function UserInfoModal({ InfoClose, infoshow, user }) {
  const blockedStatus = user.blocked ? "yes" : "no";
  console.log(user)

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
                <div className="accepthintText">사용자 id</div>
                <input
                  type="text"
                  className="input1boxzero"
                  value={user.userId}
                  readOnly
                />
              </div>
              <div className="firstacceptrow">
                <div className="accepthintText">사용자 이름</div>
                <input
                  type="text"
                  className="input1box"
                  value={user.userName}
                  readOnly
                />
              </div>
              <div className="thirdaccpetrow">
                <div className="foralign">
                  <div className="accepthintText">가입일</div>
                  <input
                    type="text"
                    className="input2box"
                    value={user.joinDate}
                    readOnly
                  />
                </div>
                <div className="foralign">
                  <div className="accepthintText">닉네임</div>
                  <input
                    type="text"
                    className="input2box"
                    value={user.userNickname}
                    readOnly
                  />
                </div>
              </div>
              <div className="thirdaccpetrow">
                <div className="foralign">
                  <div className="accepthintText">이메일</div>
                  <input
                    type="text"
                    className="input2box"
                    value={user.userEmail}
                    readOnly
                  />
                </div>
                <div className="foralign">
                  <div className="accepthintText">전화번호</div>
                  <input
                    type="text"
                    className="input2box"
                    value={user.userPhone}
                    readOnly
                  />
                </div>
              </div>
              <div className="thirdaccpetrow">
                <div className="foralign">
                  <div className="accepthintText">계정 금지 유무</div>
                  <input
                    type="text"
                    className="input2box"
                    value={blockedStatus}
                    readOnly
                  />
                </div>
                <div className="foralign">
                  <div className="accepthintText">탈퇴일</div>
                  <input
                    type="text"
                    className="input2box"
                    value={user.quitDate}
                    readOnly
                  />
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

export default UserInfoModal;
