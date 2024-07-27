import React, { useState, useEffect } from "react";
import "../../css/components/Modal/SigninModal.css";
import DatePicker from "react-datepicker";
import Cal from "../../assets/images/modal/cal.png";
import Time from "../../assets/images/modal/time.png";
import "../../css/components/Modal/SendTalkModal.css";
import axios from 'axios';

function SendTalkModal({ TalkClose, talkshow, restId }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(""); // 새로운 상태 추가
  const [message, setMessage] = useState("");
  const [uniqueTimes, setUniqueTimes] = useState([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
      try {
        const response = await axios.get(`https://waitmate.shop/api/reservations/rest/${restId}/time/${formattedDate}`);
        const unique = [...new Set(response.data.map(item => item.split(' ')[1].substring(0, 5)))];
        const sortedUnique = unique.sort((a, b) => {
          const [aHours, aMinutes] = a.split(':').map(Number);
          const [bHours, bMinutes] = b.split(':').map(Number);
          return aHours - bHours || aMinutes - bMinutes;
        });
        setUniqueTimes(sortedUnique);
      } catch (error) {
        console.error("Error fetching reservation times:", error);
      }
    };

    fetchTimeline();
  }, [selectedDate, restId]);

  const handleSendTalk = () => {
    // 알림톡 전송 로직
    console.log(`Selected Date: ${selectedDate.toISOString().split('T')[0]}`);
    console.log(`Selected Time: ${selectedTime}`);
    setMessage("");
    TalkClose();
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClose = () => {
    setSelectedDate(new Date());
    setMessage("");
    TalkClose();
  };

  const minDate = new Date(); // 현재 날짜부터 선택 가능하도록 설정

  return (
    <div
      id={talkshow ? "signinbackgroundon" : "signinbackgroundoff"}
      onClick={(e) => {
        if (
          e.target.id === "signinbackgroundon" ||
          e.target.id === "signinbackgroundoff"
        ) {
          handleClose();
        }
      }}
    >
      <div className={`talkModal ${talkshow ? "signinshow" : "signinhide"}`}>
        <div className="signinModalContent">
          <div className="signinboldText">알림톡 전송</div>
          <div className="signinhintText">예약 고객들에게 알림톡 전송하기</div>
        </div>
        <div className="talkModalContent">
          <div className="talkmodalUpperBox">
            <div className="boxWrapperForAlign">
              <div className="explanationTextintalk">대상 날짜</div>
              <div className="dateborderWrapper">
                <img src={Cal} alt="" className="calphoto" />
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={minDate}
                  className="pickerdate insmallrev"
                  placeholderText="DATE"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            <div className="boxWrapperForAlign">
              <div className="explanationTextintalk">예약 시간</div>
              <div className="dateborderWrapper">
                <img src={Time} alt="" className="calphoto" />
                <select className="timeSelectBox" onChange={handleTimeChange} value={selectedTime}>
                  <option value="" disabled>시간 선택</option>
                  {uniqueTimes.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="talkmodalLowerBox">
            <div className="explanationTextintalk">전달 내용</div>
            <textarea 
              placeholder="최대 200자 까지 작성 가능합니다."
              maxLength={200}
              className="talkTextInput"
              value={message}
              onChange={handleMessageChange}
            />
          </div>
        </div>
        <div className="signinModalButton">
          <button className="signinModalPersonal" onClick={handleSendTalk}>
            전송
          </button>
          <button className="signinModalRest" onClick={handleClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendTalkModal;
