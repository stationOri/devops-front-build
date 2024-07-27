import "../css/pages/RestaurantSignup.css";
import Oriblue from "../assets/images/oriblue.png";
import File from "../components/File";
import HeaderOrange from "../components/HeaderOrange";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

function RestaurantSignin() {
  const [email, setEmail] = useState('');
  const [restName, setRestName] = useState('');
  const [restPhone, setRestPhone] = useState('');
  const [restName2, setRestName2] = useState('');
  const [restData, setRestData] = useState('');
  const [restImageUrl, setRestImageUrl] = useState('');
  const ref = useRef(null);
  const navigate = useNavigate();

  const onChangeRestData = (value) => {
    const onlyNumber = value.replace(/[^0-9]/g, '');
    setRestData(onlyNumber);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const userinfo = jwtDecode(storedToken);
        setEmail(userinfo.object.registerDto.email);
        setRestName(userinfo.object.registerDto.userName);
        setRestPhone(userinfo.object.registerDto.phone);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
        alert('유효하지 않은 이메일 주소입니다.');
        return;
    }
    if (!restName2 || !restData) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }

    let fileUrl = '';
    if (ref.current) {
        await ref.current.upload();
        fileUrl = ref.current.getFile() ? await ref.current.getFile() : ''; // 파일 URL 가져오기
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('restName', restName);
    formData.append('restPhone', restPhone);
    formData.append('restName2', restName2);
    formData.append('restData', restData);
    formData.append('file', fileUrl);

    try {
        const response = await axios.post('https://waitmate.shop/api/register/restaurant', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data > 0) {
            console.log('Signup success:', response.data);
            alert('[식당 회원가입 완료] 로그인 해주세요.');
            navigate("/");
        } else if (response.data === 0) {
            alert('[회원가입 실패] 중복된 핸드폰 번호입니다');
        } else {
            alert('[회원가입 실패] 회원가입에 실패하였습니다.');
        }
    } catch (error) {
        console.error('Signup failed:', error);
    }
};
  return (
    <div className="fullWrapper">
      <HeaderOrange />
      <div className="restSigninWrapper">
        <div className="signinHeader">
          <img className="ori" src={Oriblue} alt="duck" />
          <div className="headertext">기업 회원가입</div>
          <div className="headerexplain">식당 정보 및 업체 정보를 입력해주시기 바랍니다.</div>
        </div>
        <div className="signinContent">
          <div className="row">
            <div className="input1btn1">
              <div className="explainText">
                담당자 이메일*
              </div>
              <div className="buttoninputWrapper">
                <input
                  type="text"
                  className="input1"
                  placeholder="담당자 이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="wrapper2">
              <div className="explainText">
                담당자 이름*
              </div>
              <input
                type="text"
                className="input2"
                placeholder="담당자 이름"
                value={restName}
                disabled
              />
            </div>
          </div>
          <div className="row child2">
            <div className="input2btn2short">
              <div className="explainText">
                담당자 휴대폰 번호*
              </div>
              <div className="buttoninputWrapper">
                <input
                  type="text"
                  className="input1short"
                  placeholder="'-'제외"
                  value={restPhone}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="row child2">
            <div className="wrapper2">
              <div className="explainText">
                매장 이름*
              </div>
              <input
                type="text"
                className="input2"
                placeholder="매장 이름"
                maxLength={100}
                onChange={(e) => setRestName2(e.target.value)}
              />
            </div>
            <div className="wrapper2">
              <div className="explainText">
                사업자 등록번호*
              </div>
              <input
                type="text"
                className="input2"
                placeholder="숫자만 입력가능합니다.(10자리)"
                maxLength={10}
                minLength={10}
                value={restData}
                onChange={(e) => onChangeRestData(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="filebox">
              <div className="explainText">
                사업자등록증*
              </div>
              <div className="filecompoWrapper">
                <File ref={ref} onFileChange={() => {}} />
              </div>
            </div>
          </div>
        </div>
        <div className="signinFooter">
          <button className="signinSubmitBtn" onClick={handleSignup}>
            기업 회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestaurantSignin;