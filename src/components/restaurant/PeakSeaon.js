import React, { useState, useEffect } from "react";
import axios from "axios";
import DateBox from "../Datebox";
import TimeSlot from "../Timeslot";
import Trash from "../../assets/images/Restaurant/recycle-bin.png";

function PeakSeason({ restId }) {
  const [selectedDateStart, setSelectedDateStart] = useState(null);
  const [selectedDateEnd, setSelectedDateEnd] = useState(null);
  const [selectedDateReservation, setSelectedDateReservation] = useState(null);
  const [openTime, setOpenTime] = useState(null);
  const [peakSeasons, setPeakSeasons] = useState([]);

  useEffect(() => {
    const fetchPeakSeasons = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URI}/api/restaurants/peak/${restId}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setPeakSeasons(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPeakSeasons();
  }, [restId]);

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChangeStart = (date) => {
    setSelectedDateStart(formatDate(date));
  };

  const handleDateChangeEnd = (date) => {
    setSelectedDateEnd(formatDate(date));
  };

  const handleDateChangeReservation = (date) => {
    setSelectedDateReservation(formatDate(date));
  };

  const handleEnroll = async () => {
    if (!selectedDateStart || !selectedDateEnd || !selectedDateReservation || !openTime) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    const today = new Date();
    const startDateObj = new Date(selectedDateStart);
    const endDateObj = new Date(selectedDateEnd);
    const reservationDateObj = new Date(selectedDateReservation);
    const reservationDateTime = `${selectedDateReservation} ${openTime}`;

    if (startDateObj >= endDateObj) {
      alert("성수기 영업 시작일은 마감일보다 앞에 있어야 합니다.");
      return;
    }

    if (reservationDateObj >= startDateObj) {
      alert("예약 오픈일은 성수기 영업 시작일보다 앞에 있어야 합니다.");
      return;
    }

    if (reservationDateObj < today) {
      alert("예약 오픈일은 오늘 이후로 설정해야 합니다.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URI}/api/restaurants/peak`, {
        restId,
        dateStart: selectedDateStart,
        dateEnd: selectedDateEnd,
        peakOpendate: reservationDateTime,
      });
      
      const response = await axios.get(`${process.env.REACT_APP_API_URI}/api/restaurants/peak/${restId}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setPeakSeasons(data);
    } catch (error) {
      console.error("Error adding peak season:", error);
    }
  };

  const handleDelete = async (peakId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URI}/api/restaurants/peak/${peakId}`);
      const response = await axios.get(`${process.env.REACT_APP_API_URI}/api/restaurants/peak/${restId}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setPeakSeasons(data);
    } catch (error) {
      console.error("Error deleting peak season:", error);
    }
  };

  return (
    <div>
      <div className="timeWrapper">
        <div className="accinfo-bigtext">점포 운영</div>
        <div className="peakWrapper-first">
          <div className="calWrapper">
            <div className="accinfo-hintText">성수기 영업 시작일</div>
            <DateBox
              selectedDate={selectedDateStart}
              handleDateChange={handleDateChangeStart}
            />
          </div>
          <div className="calWrapper">
            <div className="accinfo-hintText">성수기 영업 마감일</div>
            <DateBox
              selectedDate={selectedDateEnd}
              handleDateChange={handleDateChangeEnd}
            />
          </div>
          <div className="calWrapper">
            <div className="accinfo-hintText">예약 오픈일</div>
            <DateBox
              selectedDate={selectedDateReservation}
              handleDateChange={handleDateChangeReservation}
            />
          </div>
          <div className="calWrapper">
            <div className="accinfo-hintText">성수기 예약 오픈 시간</div>
            <TimeSlot time={openTime} setTime={setOpenTime} />
          </div>
          <button className="peakenrollbtn" onClick={handleEnroll}>
            등록
          </button>
        </div>
        <div className="peakWrapper-second">
          {peakSeasons.map((season) => (
            <div key={season.id} className="peak-item">
              <div>{season.dateStart} ~ {season.dateEnd} | {season.peakOpendate}</div>
              <img
                src={Trash}
                alt="Delete"
                className="TrashcanImg"
                onClick={() => handleDelete(season.peakId)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PeakSeason;
