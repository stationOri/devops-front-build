import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/components/Modal/EmptyEnrollModal.css";
import closeIcon from "../../assets/images/modal/x-close.png";
import emptyIcon from "../../assets/images/modal/emptyenroll.png";
import restIcon from "../../assets/images/modal/rest.png";
import SuccessModal from "./SuccessModal";
import { useSuccessModal } from "./SuccessModalContext";

const EmptyEnrollModal = ({ isOpen, onClose, userId, name }) => {
  const { id } = useParams();
  const [opentimes, setOpentimes] = useState([]);
  const [restInfo, setRestInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [availableTimes, setAvailableTimes] = useState([]);
  const { openSuccessModal } = useSuccessModal();

  const convertDayToKorean = (day) => {
    switch (day) {
      case "MON":
        return "월요일";
      case "TUE":
        return "화요일";
      case "WED":
        return "수요일";
      case "THU":
        return "목요일";
      case "FRI":
        return "금요일";
      case "SAT":
        return "토요일";
      case "SUN":
        return "일요일";
      case "HOL":
        return "공휴일";
      default:
        return day;
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOpentimes();
      fetchRestInfo();
    }
  }, [isOpen]);

  const fetchOpentimes = async () => {
    try {
      const response = await fetch(`https://waitmate.shop/api/opentime/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch opentimes");
      }
      const data = await response.json();

      const opentimesFormatted = data.map((opentime) => ({
        ...opentime,
        restDay: convertDayToKorean(opentime.restDay),
      }));

      setOpentimes(opentimesFormatted);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAvailableTimes = async (date) => {
    try {
      const formattedDate = toKoreanDateString(new Date(date)); // 날짜를 KST로 변환
      const response = await fetch(
        `https://waitmate.shop/api/reservations/${id}/times/${formattedDate}`
      );
      if (!response.ok) {
        throw new Error("사용 가능한 시간 가져오기 실패");
      }
      const data = await response.json();

      if (
        !data ||
        !data.availabilityMap ||
        !data.availabilityMap[formattedDate]
      ) {
        setAvailableTimes({});
        console.warn(`서버에서 반환된 데이터 구조가 예상과 다릅니다:`, data);
        return;
      }

      // const times = Object.keys(data.availabilityMap[formattedDate]);
      // const timeStates = Object.values(data.availabilityMap[formattedDate]);

      // times.forEach((time, index) => {
      //   console.log(`시간: ${time}, 상태: ${timeStates[index]}`);
      // });

      setAvailableTimes(data.availabilityMap[formattedDate]);
    } catch (error) {
      console.error("사용 가능한 시간 가져오기 오류:", error);
    }
  };

  const fetchRestInfo = async () => {
    try {
      const response = await fetch(
        `https://waitmate.shop/api/restaurants/info/res/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant info");
      }
      const data = await response.json();
      setRestInfo(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchAvailableTimes(date);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleGuestIncrement = () => {
    if (selectedGuests < restInfo.maxPpl) {
      setSelectedGuests(selectedGuests + 1);
    }
  };

  const handleGuestDecrement = () => {
    if (selectedGuests > 1) {
      setSelectedGuests(selectedGuests - 1);
    }
  };

  const oneWeekLater = new Date(new Date().setDate(new Date().getDate() + 7));
  const oneMonthLater = new Date(new Date().setDate(new Date().getDate() + 30));

  const LaterDate =
    restInfo && restInfo.restReserveopenRule === "WEEKS"
      ? oneWeekLater
      : oneMonthLater;

  function toKoreanDateString(date) {
    if (!date) return null;
    const utcOffset = date.getTimezoneOffset() * 60000;
    const koreanDate = new Date(
      date.getTime() + utcOffset + 9 * 60 * 60 * 1000
    );
    return `${koreanDate.getFullYear()}-${String(
      koreanDate.getMonth() + 1
    ).padStart(2, "0")}-${String(koreanDate.getDate()).padStart(2, "0")}`;
  }

  const handleOpenModal = async () => {
    try {
      await axios.post(`https://waitmate.shop/api/vacant`, {
        userId: userId,
        restId: id,
        date: toKoreanDateString(selectedDate),
        time: selectedTime,
        people: selectedGuests,
      });
    } catch (error) {
      console.error("빈자리 알림 요청 오류:", error);
      return;
    }
    console.log("빈자리 알림 요청 완료");

    openSuccessModal(
      "빈자리 알림 요청 완료",
      "예약자 이름",
      toKoreanDateString(selectedDate),
      selectedTime,
      selectedGuests,
      onClose
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="empty-modal-header">
            <img className="empty-icon" src={emptyIcon} alt="Empty" />
            <p className="empty-enroll-title">빈자리 알림 신청</p>
          </div>
          <div className="close-btn-container">
            <button className="close-btn" onClick={onClose}>
              <img src={closeIcon} alt="Close" />
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="horizon"></div>
          <div className="empty-enroll-rest">
            <img className="rest-icon" src={restIcon} alt="Rest" />
            <div className="empty-enroll-rest-name">{name}</div>
          </div>
          <div className="horizon"></div>
          <div className="empty-enroll-content">
            <div className="empty-enroll-picker">
              <div className="empty-enroll-date-time">
                <div className="empty-enroll-date">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={LaterDate}
                    className="picker"
                    placeholderText="DATE"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div className="empty-enroll-time">
                  <select
                    id="timePicker"
                    className="picker"
                    value={selectedTime}
                    onChange={(e) => handleTimeClick(e.target.value)}
                  >
                    <option value="">TIME</option>
                    {availableTimes ? (
                      Object.entries(availableTimes).map(([time, status]) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))
                    ) : (
                      <option value="">none</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="empty-enroll-content-text">
                <button
                  className="guest-picker-btn"
                  onClick={handleGuestDecrement}
                >
                  -
                </button>
                <span className="guest-picker-value">
                  <span className="selected-guest">{selectedGuests}</span>{" "}
                  Guests
                </span>
                <button
                  className="guest-picker-btn"
                  onClick={handleGuestIncrement}
                >
                  +
                </button>
              </div>
            </div>
            <div className="empty-enroll-content-text">
              해당 시간에 빈자리가 생겼을 시,
            </div>
            <div className="empty-enroll-content-text">
              알림톡을 보내드립니다.
            </div>
          </div>
          <div className="empty-enroll-btn">
            <div className="empty-btn-content" onClick={handleOpenModal}>
              등록
            </div>
          </div>
        </div>
      </div>
      <SuccessModal />
    </div>
  );
};

export default EmptyEnrollModal;
