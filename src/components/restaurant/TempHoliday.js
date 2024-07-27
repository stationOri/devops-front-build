import React, { useState, useEffect } from "react";
import axios from "axios";
import DateBox from "../Datebox";
import Trash from "../../assets/images/Restaurant/recycle-bin.png";

function TempHoliday({ restId }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [tempHolidays, setTempHolidays] = useState([]);

  useEffect(() => {
    const fetchTempHolidays = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/restaurants/rest-temp-holiday/${restId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setTempHolidays(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTempHolidays();
  }, [restId]);

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartDateChange = (date) => {
    setStartDate(formatDate(date));
  };

  const handleEndDateChange = (date) => {
    setEndDate(formatDate(date));
  };

  const handleEnroll = async () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }
  
    const today = new Date();
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
  
    if (startDateObj < today) {
      alert("휴무 시작일은 현재 날짜 이후여야 합니다.");
      return;
    }
  
    if (startDateObj >= endDateObj) {
      alert("시작일은 종료일보다 이전이어야 합니다.");
      return;
    }
  
    try {
      // 임시 휴무 등록
      await axios.post("http://localhost:8080/restaurants/rest-temp-holiday", {
        restId,
        startDate,
        endDate,
      });
      
      // 등록 후 데이터 목록을 다시 불러옵니다.
      const response = await axios.get(`http://localhost:8080/restaurants/rest-temp-holiday/${restId}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setTempHolidays(data);
    } catch (error) {
      console.error("Error adding temp holiday:", error);
    }
  };
  

  const handleDelete = async (holidayId) => {
    console.log("Deleting holiday with ID:", holidayId); // Debugging line
    try {
      await axios.delete(`http://localhost:8080/restaurants/rest-temp-holiday/${holidayId}`);
      const response = await axios.get(`http://localhost:8080/restaurants/rest-temp-holiday/${restId}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setTempHolidays(data);
    } catch (error) {
      console.error("Error deleting temp holiday:", error);
    }
  };

  return (
    <div className="rest-temphol">
      <div className="accinfo-bigtext">임시 휴무 지정</div>
      <div className="temp-holiday-firstrow">
        <div className="calWrapper">
          <div className="accinfo-hintText">휴무 시작일</div>
          <DateBox
            selectedDate={startDate}
            handleDateChange={handleStartDateChange}
          />
        </div>
        <div className="calWrapper">
          <div className="accinfo-hintText">휴무 마감일</div>
          <DateBox
            selectedDate={endDate}
            handleDateChange={handleEndDateChange}
          />
        </div>
        <button className="enrollbutton" onClick={handleEnroll}>
          등록
        </button>
      </div>
      <div className="temp-holiday-secondrow">
        {tempHolidays.map((holiday) => (
          <div key={holiday.id} className="holiday-item">
            <div>{holiday.startDate} ~ {holiday.endDate}</div>
            <img
              src={Trash}
              alt="Delete"
              className="TrashcanImg"
              onClick={() => handleDelete(holiday.tempHolidayId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TempHoliday;
