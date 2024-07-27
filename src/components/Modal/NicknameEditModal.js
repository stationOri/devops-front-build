import React, { useState } from "react";
import Logo from "../../assets/images/oriblue.png";
import "../../css/components/Modal/SigninModal.css";
import "../../css/components/Modal/NicknameEditModal.css";

function NicknameEditModal({ EditClose, editshow, userId, onSuccess }) {
  const [nickname, setNickname] = useState("");

  const handleEditActivate = async (e) => {
    e.preventDefault();
    console.log(nickname);

    const payload = {
      userNickname: nickname,
    };

    try {
      const response = await fetch(`https://waitmate.shop/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to edit nickname");
      }

      const data = await response.json();
      console.log("닉네임 수정 완료:", data);
      alert("닉네임이 성공적으로 수정되었습니다.");
      onSuccess();
      EditClose();
    } catch (error) {
      console.error("닉네임 수정 실패:", error);
      alert("닉네임 수정을 실패했습니다.");
    }
  };

  return (
    <div
      id={editshow ? "signinbackgroundon" : "signinbackgroundoff"}
      onClick={(e) => {
        if (
          e.target.id === "signinbackgroundon" ||
          e.target.id === "signinbackgroundoff"
        ) {
          EditClose();
        }
      }}
    >
      <div className={`signinModal ${editshow ? "signinshow" : "signinhide"}`}>
        <div className="signinModalHeader">
          <img src={Logo} alt="Logo" className="signinori" />
          <button className="signinclosebtn" onClick={EditClose}>
            X
          </button>
        </div>
        <div className="signinModalContent">
          <div className="signinboldText">닉네임 수정</div>
          <div className="signinhintText">수정 할 닉네임을 적어주세요</div>
        </div>
        <div className="inputBoxinNickname">
          <div className="NicknameHinttest">닉네임</div>
          <input
            type="text"
            className="nicknameinputBox"
            placeholder="닉네임(최대 20자)"
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="signinModalButton">
          <button className="signinModalPersonal" onClick={handleEditActivate}>
            수정
          </button>
          <button className="signinModalRest" onClick={EditClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default NicknameEditModal;
