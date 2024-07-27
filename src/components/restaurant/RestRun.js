import React, { useState, useEffect } from "react";
import axios from "axios";
import TimeSlot from "../Timeslot";
import Trash from "../../assets/images/Restaurant/recycle-bin.png"; // 삭제 아이콘

function RestRun({ restId }) {
  const [checkedDays, setCheckedDays] = useState([]);
  const [breakTime, setBreakTime] = useState(false); // 브레이크 타임을 boolean으로 설정
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [lastOrderTime, setLastOrderTime] = useState("");
  const [breakStartTime, setBreakStartTime] = useState("");
  const [breakEndTime, setBreakEndTime] = useState("");
  const [openTimeResult, setOpenTimeResult] = useState(null);

  useEffect(() => {
    const fetchOpenTime = async () => {
      const result = await GetOpenTime(restId);
      setOpenTimeResult(result);
    };

    fetchOpenTime();
  }, [restId]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setCheckedDays((prev) =>
      checked ? [...prev, value] : prev.filter((day) => day !== value)
    );
  };

  const handleBreakTimeChange = (event) => {
    const { checked } = event.target;
    // 브레이크 타임 체크박스가 해제되면 브레이크 시간도 초기화
    if (!checked) {
      setBreakStartTime("");
      setBreakEndTime("");
    }
    setBreakTime(checked);
  };

  const GetOpenTime = async (restId) => {
    try {
      const response = await axios.get(`http://localhost:8080/opentime/${restId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching open time:', error);
      return null;
    }
  };

  const validateTimes = () => {
    const open = new Date(`1970-01-01T${openTime}:00`);
    const close = new Date(`1970-01-01T${closeTime}:00`);
    const lastOrder = new Date(`1970-01-01T${lastOrderTime}:00`);
    const breakStart = new Date(`1970-01-01T${breakStartTime}:00`);
    const breakEnd = new Date(`1970-01-01T${breakEndTime}:00`);

    // 마감 시간이 오픈 시간보다 빠를 수 없도록 검증
    if (open >= close) {
      alert("오픈시간은 마감시간보다 이전이어야 합니다.");
      return false;
    }

    // 브레이크 타임이 설정된 경우
    if (breakTime) {
      if (breakStart <= open) {
        alert("브레이크 시작시간은 오픈시간 이후이어야 합니다.");
        return false;
      }
      if (breakEnd >= close) {
        alert("브레이크 종료시간은 마감시간 이전이어야 합니다.");
        return false;
      }
      if (breakEnd <= breakStart) {
        alert("브레이크 종료시간은 브레이크 시작시간 이후여야 합니다.");
        return false;
      }
    }

    // 라스트 오더 시간은 마감 시간보다 이전이어야 하며, 최소 30분 차이가 나야 한다
    if (lastOrder >= close) {
      alert("라스트오더 시간은 마감시간보다 이전이어야 합니다.");
      return false;
    }

    return true;
  };

  const updateOpenTimes = async () => {
    if (!validateTimes()) return; // 유효성 검사 실패 시 반환

    try {
      for (const day of checkedDays) {
        const data = {
          restOpen: openTime,
          restClose: closeTime,
          restLastorder: lastOrderTime,
          restBreakstart: breakTime ? breakStartTime : "",
          restBreakend: breakTime ? breakEndTime : ""
        };

        await axios.put(`http://localhost:8080/opentime/rest/${restId}/day/${day}`, data);
        console.log(`Updated ${day}`);
      }
      // After updating, fetch the latest open times
      const updatedResult = await GetOpenTime(restId);
      setOpenTimeResult(updatedResult);
    } catch (error) {
      console.error('Error updating open times:', error);
    }
  };

  const handleDelete = async (day) => {
    try {
      // 서버에 빈 데이터로 업데이트 요청
      const data = {
        restOpen: "",
        restClose: "",
        restLastorder: "",
        restBreakstart: "",
        restBreakend: ""
      };

      await axios.put(`http://localhost:8080/opentime/rest/${restId}/day/${day}`, data);
      console.log(`Cleared data for ${day}`);
      // 업데이트 후 openTimeResult를 재설정
      const updatedResult = await GetOpenTime(restId);
      setOpenTimeResult(updatedResult);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const daysOfWeek = [
    { value: 'MON', label: '월' },
    { value: 'TUE', label: '화' },
    { value: 'WED', label: '수' },
    { value: 'THU', label: '목' },
    { value: 'FRI', label: '금' },
    { value: 'SAT', label: '토' },
    { value: 'SUN', label: '일' },
  ];

  return (
    <div className="rest-date">
      <div className="accinfo-bigtext">운영 시간</div>
      <div className="rest-date-first">
        <div className="checkBoxWrapper">
          <div className="accinfo-hintText">영업요일</div>
          <div className="checkboxes">
            {daysOfWeek.map((day) => (
              <label key={day.value} className="ccinfo-checkbox">
                <input
                  type="checkbox"
                  name={day.value}
                  value={day.value}
                  checked={checkedDays.includes(day.value)}
                  onChange={handleCheckboxChange}
                />
                {day.label}
              </label>
            ))}
          </div>
        </div>
        <div className="breaktime">
          <div className="accinfo-hintText">브레이크타임</div>
          <label className="ccinfo-checkbox">
            <input
              type="checkbox"
              name="breakTime"
              checked={breakTime}
              onChange={handleBreakTimeChange}
            />
            브레이크 타임 적용
          </label>
        </div>
      </div>
      <div className="rest-date-last">
        <div className="timeWrapper">
          <div className="accinfo-hintText">오픈시간</div>
          <TimeSlot time={openTime} setTime={setOpenTime} />
        </div>
        <div className="timeWrapper">
          <div className="accinfo-hintText">마감 시간</div>
          <TimeSlot time={closeTime} setTime={setCloseTime} />
        </div>
        <div className="timeWrapper">
          <div className="accinfo-hintText">라스트오더</div>
          <TimeSlot time={lastOrderTime} setTime={setLastOrderTime} />
        </div>
        <div className="timeWrapper">
          <div className="accinfo-hintText">브레이크 시작시간</div>
          <TimeSlot
            time={breakStartTime}
            setTime={setBreakStartTime}
            disabled={!breakTime}
          />
        </div>
        <div className="timeWrapper">
          <div className="accinfo-hintText">브레이크 종료시간</div>
          <TimeSlot
            time={breakEndTime}
            setTime={setBreakEndTime}
            disabled={!breakTime}
          />
        </div>
        <button
          className="runningTimeenroll"
          onClick={updateOpenTimes}
        >
          등록
        </button>
      </div>
      <div className="opentimeresult">
        {openTimeResult ? (
          openTimeResult.map((time, index) => (
            <div key={index}>
              { time.restOpen && (
                <div className="opentimecontWrapper">
                  <div className="opentimeleft">
                    <div className="highlightDay">{time.restDay}</div>
                    <div className="opentime1">{time.restOpen} ~ {time.restClose}</div>
                    {time.restBreakstart && (
                      <div className="opentime2"> | break: {time.restBreakstart} ~ {time.restBreakend} </div>
                    )}
                    {time.restLastorder && (
                      <div className="opentime3"> | last Order: {time.restLastorder} </div>
                    )}
                  </div>
                  <img
                    src={Trash}
                    alt="Delete"
                    className="TrashcanImg"
                    onClick={() => handleDelete(time.restDay)} // 휴지통 클릭 시 handleDelete 호출
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p>오픈 시간 정보를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}

export default RestRun;
