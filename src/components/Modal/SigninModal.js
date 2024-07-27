import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/images/oriblue.png";
import "../../css/components/Modal/SigninModal.css";

function SigninModal({ signinClose, signinshow }) {
  const navigate = useNavigate();

  const handleGoToSignUpPer = () => {
    navigate('/usersignup');
  };

  const handleGoToSignUpRes = () => {
    navigate('/restaurantsignup');
  };

  return (
    <div
      id={signinshow ? "signinbackgroundon" : "signinbackgroundoff"}
      onClick={(e) => {
        if (
          e.target.id === "signinbackgroundon" ||
          e.target.id === "signinbackgroundoff"
        ) {
          signinClose();
        }
      }}
    >
      <div className={`signinModal ${signinshow ? "signinshow" : "signinhide"}`}>
        <div className="signinModalHeader">
          <img src={Logo} alt="" className="signinori"/>
          <button className='signinclosebtn' onClick={signinClose}>
            X
          </button>
        </div>
        <div className="signinModalContent">
          <div className="signinboldText">회원가입 유형 선택</div>
          <div className="signinhintText">가입할 유형을 선택하세요.</div>
        </div>
        <div className="signinModalButton">
          <button className="signinModalPersonal" onClick={handleGoToSignUpPer}>개인 회원</button>
          <button className="signinModalRest" onClick={handleGoToSignUpRes}>식당 회원</button>
        </div>
      </div>
    </div>
  );
}

export default SigninModal;
