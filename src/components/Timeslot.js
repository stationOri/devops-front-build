import React, { useState } from "react";
import Time from "../assets/images/modal/time.png";
import "../css/components/Modal/SendTalkModal.css";

// 시간을 생성하는 유틸리티 함수
const generateTimes = () => {
  const times = [];
  let hours = 0;
  let minutes = 0;

  while (hours < 24) {
    // 00:00 형식으로 시간을 포맷
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    times.push(time);

    // 분을 30분 단위로 증가
    minutes += 30;
    if (minutes === 60) {
      minutes = 0;
      hours += 1;
    }
  }

  return times;
};

function TimeSlot({ time, setTime, disabled }) {
  const uniqueTimes = generateTimes();

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  return (
    <div className="dateborderWrapper timeslotsize">
      <img src={Time} alt="" className="calphoto" />
      <select
        className="timeSelectBox"
        onChange={handleTimeChange}
        value={time}
        disabled={disabled}
      >
        <option value="" disabled>시간 선택</option>
        {uniqueTimes.map((timeOption, index) => (
          <option key={index} value={timeOption}>
            {timeOption}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimeSlot;
