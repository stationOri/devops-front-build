import React, { useState, useEffect, useCallback } from "react";
import Waiting from "../../assets/images/Restaurant/waiting.png";
import Phone from "../../assets/images/Restaurant/phone.png";
import "../../css/components/restaurant/Reservation.css";
import Loading from "../Loading";
import Cal from "../../assets/images/modal/cal.png";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import SendTalkModal from "../Modal/SendTalkModal";
import Deposit from "./Deposit";
import Today from "./Today";
import DetailedReservation from "./DetailedReservation";

function Reservation({ restId, onMenuClick }) {
  const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };
  const [loading, setLoading] = useState(true);
  const [rev, setRev] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tableDates, setTableDates] = useState({
    today: selectedDate,
    day1: addDays(selectedDate, 1),
    day2: addDays(selectedDate, 2),
    day3: addDays(selectedDate, 3),
  });
  const [rev1, setRev1] = useState([]);
  const [rev2, setRev2] = useState([]);
  const [rev3, setRev3] = useState([]);
  const [rev4, setRev4] = useState([]);
  const [talkshow, setTalkShow] = useState(false);

  const TalkClose = () => setTalkShow(false);
  const TalkShow = () => setTalkShow(true);

  const getLastYearStartDate = () => {
    const now = new Date();
    return new Date(now.getFullYear() - 1, 0, 1);
  };

  const minDate = getLastYearStartDate();
  const LaterDate = new Date(new Date().setDate(new Date().getDate() + 30));

  const getWait = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/restaurants/info/revWait/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const text = await response.text();
      setRev(text === "B" || text === "C");
    } catch (error) {
      console.error("Error revWait status:", error);
    }
  }, [restId]);

  const getRev = useCallback(async (restId, tableDates) => {
    if (!tableDates.today) {
      console.error("Table dates are not set properly:", tableDates);
      return;
    }

    try {
      const [response1, response2, response3, response4] = await Promise.all([
        axios.get(
          `http://localhost:8080/reservations/reservation/rest/${restId}/${formatDateFetch(
            tableDates.today
          )}`
        ),
        axios.get(
          `http://localhost:8080/reservations/reservation/rest/${restId}/${formatDateFetch(
            tableDates.day1
          )}`
        ),
        axios.get(
          `http://localhost:8080/reservations/reservation/rest/${restId}/${formatDateFetch(
            tableDates.day2
          )}`
        ),
        axios.get(
          `http://localhost:8080/reservations/reservation/rest/${restId}/${formatDateFetch(
            tableDates.day3
          )}`
        ),
      ]);

      setRev1(sortByDateTime(response1.data));
      setRev2(sortByDateTime(response2.data));
      setRev3(sortByDateTime(response3.data));
      setRev4(sortByDateTime(response4.data));
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  }, []);

  const sortByDateTime = (data) =>
    data.sort((a, b) => new Date(a.resDate) - new Date(b.resDate));

  useEffect(() => {
    const fetchData = async () => {
      await getWait();
      await getRev(restId, tableDates);
      setLoading(false);
    };

    fetchData();
  }, [getWait, getRev, restId, tableDates]);

  const handleFindClick = () => {
    setTableDates({
      today: selectedDate,
      day1: addDays(selectedDate, 1),
      day2: addDays(selectedDate, 2),
      day3: addDays(selectedDate, 3),
    });
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  };

  const formatDateFetch = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    setTableDates({
      today: new Date(),
      day1: addDays(new Date(), 1),
      day2: addDays(new Date(), 2),
      day3: addDays(new Date(), 3),
    });
  }, []);

  const handleDateChange = (date) => setSelectedDate(date);
  const gotoRestInfo = () => {
    onMenuClick("계정 정보");
  };
  return (
    <div className="WrapperWithoutBorder">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="UpperBoxRestheight">
            <Deposit restId={restId} />
            <Today rev={rev} restId={restId} />
          </div>
          <div className="LowerBoxRest">
            <div className="rest-text">
              <img src={Waiting} alt="" className="rest-text-logo" />
              <p className="rest-bold-text">Booking Status</p>
            </div>
            <div className="forspacingInrev">
              <div className="dateselectWrapper">
                <div className="dateborderWrapper">
                  <img src={Cal} alt="" className="calphoto" />
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={LaterDate}
                    className="pickerdate insmallrev"
                    placeholderText="DATE"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <button className="findbtn" onClick={handleFindClick}>
                  찾기
                </button>
              </div>
              <div className="phoneWrapper">
                { rev&&(
                  <>
                <img src={Phone} alt="" className="phoneicon" />
                <div className="phoneText" onClick={TalkShow}>
                  알림톡 전송하기
                </div>
                </>
                ) }
              </div>
            </div>
            {rev ? (
              <div className="bookingtable">
                <div className="colWarpper">
                  <div className="tableBorderyes">
                    {formatDate(tableDates.today)}
                  </div>
                  <DetailedReservation
                    reservations={rev1}
                    row={1}
                    restId={restId}
                  />
                </div>
                <div className="colWarpper">
                  <div className="tableBorderyes">
                    {formatDate(tableDates.day1)} (D+1)
                  </div>
                  <DetailedReservation
                    reservations={rev2}
                    row={2}
                    restId={restId}
                  />
                </div>
                <div className="colWarpper">
                  <div className="tableBorderyes">
                    {formatDate(tableDates.day2)} (D+2)
                  </div>
                  <DetailedReservation
                    reservations={rev3}
                    row={3}
                    restId={restId}
                  />
                </div>
                <div className="colWarpper">
                  <div className="tableBorderyesend">
                    {formatDate(tableDates.day3)} (D+3)
                  </div>
                  <DetailedReservation
                    reservations={rev4}
                    row={4}
                    restId={restId}
                  />
                </div>
              </div>
            ) : (
              <div className="bookingtableno">
                <div className="rowWrapper">
                  <div className="tableBorder forRow">
                    {formatDate(tableDates.today)}
                  </div>
                  <div className="tableBorder forRow">
                    {formatDate(tableDates.day1)} (D+1)
                  </div>
                  <div className="tableBorder forRow">
                    {formatDate(tableDates.day2)} (D+2)
                  </div>
                  <div className="tableBorderend forRow">
                    {formatDate(tableDates.day3)} (D+3)
                  </div>
                </div>
                <div className="rowWrapper2">
                  <div>예약 기능을 사용하지 않고 있습니다.</div>
                  <div>
                    해당 기능을 사용하려면 가게 정보 수정 화면에서 예약을 활성화
                    해주세요.
                  </div>
                  <button onClick={gotoRestInfo}>
                    가게 정보 수정하러 가기
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <SendTalkModal
        TalkClose={TalkClose}
        talkshow={talkshow}
        restId={restId}
      />
    </div>
  );
}

export default Reservation;
