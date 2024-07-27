import React, { useState, useEffect } from "react";
import Now from "../../assets/images/Restaurant/now.png";

function Today({rev, restId}) {
  const [todayinfo, setTodayInfo] = useState([]);
  const [todaynum, setTodayNum] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getToday(restId,selectedDate);
  }, [restId,rev]);

  const formatDateFetch = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getToday = async (restId,selectedDate) => {
    try {
      const response = await fetch(`https://waitmate.shop/api/reservations/rest/${restId}/time/${formatDateFetch(selectedDate)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const json = await response.json();
      const reservations = json.map(dateString => ({ resDatetime: dateString }));
      console.log(reservations);
      const timeCounts = reservations.reduce((acc, reservation) => {
        const hour = new Date(reservation.resDatetime).getHours();
        const minute = new Date(reservation.resDatetime).getMinutes().toString().padStart(2, '0'); 
        const timeSlot = `${hour}:${minute}`;
        if (!acc[timeSlot]) {
          acc[timeSlot] = 0;
        }
        acc[timeSlot] += 1;
        return acc;
      }, {});
      setTodayNum(json.length);
      setTodayInfo(timeCounts);
    } catch (error) {
      console.error("Error fetching today's reservations:", error);
    }
  };

  return (
    <div className="upperboxright">
              <div className="rest-text">
                <img src={Now} alt="" className="rest-text-logo" />
                <p className="rest-bold-text">Today</p>
              </div>
              <div className="rest-content-boxwai">
                <div className="bookingExText">
                  오늘의 예약{" "}
                  <span className="spanforOrangerev">{todaynum}</span> 건
                </div>
                <hr className="innerHrLinewai" />
                {rev ? (
                          todaynum === 0 ? (
                            <div className="resernoinfobox">
                              예약이 존재하지 않습니다.
                            </div>
                          ) : (
                            <div className="reserinfobox">
                              {Object.entries(todayinfo).map(([timeSlot, count]) => (
                                <div className="innerslot" key={timeSlot}>
                                  {timeSlot}{" "}
                                  <span className="spanforcounting">{count}</span>건
                                </div>
                              ))}
                            </div>
                          )
                          ) : (
                            <div className="resernoinfobox">
                              예약을 사용하지 않습니다.
                            </div>
                          )}
                <hr className="innerHrLinewai" />
              </div>
            </div>
  );
}

export default Today;