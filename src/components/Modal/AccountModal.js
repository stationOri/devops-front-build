import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/oriblue.png";
import "../../css/components/Modal/SigninModal.css";
import "../../css/components/Modal/AccountModal.css";
import axios from "axios";
import Select from "react-select";

function AccountModal({ closeInfoModal, infoshow, restId }) {
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);

  const getAccount = async(restId) => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URI}/api/restaurants/info/account/${restId}`);          
          const [bank, number] = response.data.split(" ");
          setAccountNumber(number);
          const initialBank = bankOptions.find(option => option.label === bank);
          if (initialBank) {
            setSelectedBank(initialBank);
          }
        
                } catch (error) {
          console.error("Error fetching deposit:", error);
        }
    }

  useEffect(() => {
    getAccount(restId);
  
  }, [restId]);


  const bankOptions = [
    { value: 'kookmin', label: '국민은행' },
    { value: 'shinhan', label: '신한은행' },
    { value: 'woori', label: '우리은행' },
    { value: 'hana', label: '하나은행' },
    { value: 'ibk', label: '기업은행' },
    { value: 'nh', label: '농협은행' },
    { value: 'sc', label: 'SC제일은행' },
    { value: 'kbank', label: '케이뱅크' },
    { value: 'kakao', label: '카카오뱅크' },
    { value: 'post', label: '우체국' },
  ];

  const handleAccountSet = async () => {
    const restAccount=`${selectedBank.label} ${accountNumber}`
        try {
      const response = await axios.put(`${process.env.REACT_APP_API_URI}/api/restaurants/info/account/${restId}`, { 
         restAccount 
       });
      alert("수정 완료")
    } catch (error) {
      console.error("Error:", error);
      alert("수정 실패! 다시 시도해주세요")
    } finally {
      // setAccountNumber("");
      // setSelectedBank(null);
      closeInfoModal();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9]/g, "");
    setAccountNumber(filteredValue);
  };

  return (
    <div
      id={infoshow ? "signinbackgroundon" : "signinbackgroundoff"}
      onClick={(e) => {
        if (
          e.target.id === "signinbackgroundon" ||
          e.target.id === "signinbackgroundoff"
        ) {
          closeInfoModal();
        }
      }}
    >
      <div className={`accountModal ${infoshow ? "signinshow" : "signinhide"}`}>
        <div className="signinModalHeader">
          <img src={Logo} alt="" className="signinori" />
          <button className="signinclosebtn" onClick={closeInfoModal}>
            X
          </button>
        </div>
        <div className="signinModalContent">
          <div className="signinboldText">계좌정보 설정</div>
          <div className="signinhintText">
            노쇼 예약금을 환불받을 계좌를 설정합니다.
          </div>
        </div>
        <div className="selectboxWrapper">
          <div className="accountText">은행</div>
          <Select
            options={bankOptions}
            value={selectedBank}
            onChange={setSelectedBank}
            placeholder="은행 선택"
            className="select-box-inaccchange"
            classNamePrefix="react-select"
          />
        </div>
        <div className="accountinputWrapper">
          <div className="accountText">계좌번호</div>
          <input
            type="text"
            className="accountinput"
            placeholder="숫자만 입력해주세요"
            value={accountNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="accountBtnWrapper">
          <button className="accountedityes" onClick={handleAccountSet}>
            수정
          </button>
          <button className="accounteditno" onClick={closeInfoModal}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountModal;
