import React, { useState, useEffect } from "react";
import Select from "react-select";
import PeakSeason from "./PeakSeaon";
import axios from "axios";

const revunitOptions = [
  { value: "WEEK", label: "일주일" },
  { value: "MONTH", label: "한달" },
];

const revperiodOptions = [
  { value: "HALFHOUR", label: "30분" },
  { value: "ONEHOUR", label: "1시간" },
];

function RevWaitSetting({ restId }) {
  const [inputMaxGuests, setInputMaxGuests] = useState("");
  const [inputMaxTables, setInputMaxTables] = useState("");
  const [reservationCustomFee, setReservationCustomFee] = useState("");
  const [isWaitChecked, setIsWaitChecked] = useState(false);
  const [revunit, setRevunit] = useState(null);
  const [revperiod, setRevperiod] = useState(null);
  const [reservationFee, setReservationFee] = useState("");
  const [isReservationChecked, setIsReservationChecked] = useState(false);

  // Function to fetch settings
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`https://waitmate.shop/api/restaurants/info/setting/revwait/${restId}`);
      const setting = response.data;
      console.log(setting);

      setIsReservationChecked(setting.revWait === "B" || setting.revWait === "C");
      setIsWaitChecked(setting.revWait === "A" || setting.revWait === "C");

      setRevunit(revunitOptions.find(option => option.value === setting.restReserveopenRule) || null);
      setRevperiod(revperiodOptions.find(option => option.value === setting.restReserveInterval) || null);

      setInputMaxGuests(setting.maxPpl || "");
      setInputMaxTables(setting.restTablenum || "");

      setReservationFee(setting.restDepositMethod || "");
      setReservationCustomFee(setting.restDeposit || "");
    } catch (error) {
      console.error("Settings fetch error:", error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [restId]);

  const handleRevunitChange = (selectedOption) => {
    setRevunit(selectedOption);
  };

  const handleRevperiodChange = (selectedOption) => {
    setRevperiod(selectedOption);
  };

  const handleReservationFeeChange = (event) => {
    // Update reservationFee based on the checkbox checked state
    const value = event.target.value;
    if (value === "custom") {
      setReservationFee("A");
    } else if (value === "20%") {
      setReservationFee("B");
    } else {
      setReservationFee("");
    }
  };

  const handleWaitChange = (event) => {
    setIsWaitChecked(event.target.checked);
  };

  const handleReservationChange = (event) => {
    setIsReservationChecked(event.target.checked);
  };

  const handleSubmit = async () => {
    if (!isWaitChecked && !isReservationChecked) {
      alert("원격 줄서기 또는 예약을 선택해 주세요.");
      return;
    }
    
    try {
      const revWaitValue = isWaitChecked && isReservationChecked ? "C" :
                           isWaitChecked ? "A" :
                           isReservationChecked ? "B" :
                           ""; 

      const data = {
        maxPpl: inputMaxGuests,
        restTablenum: inputMaxTables,
        restDepositMethod: reservationFee,
        restDeposit: reservationCustomFee,
        revWait: revWaitValue,
        restReserveopenRule: revunit ? revunit.value : null,
        restReserveInterval: revperiod ? revperiod.value : null,
      };

      await axios.put(`https://waitmate.shop/api/restaurants/info/setting/revwait/${restId}`, data);
      alert("설정이 저장되었습니다.");
      await fetchSettings();
    } catch (error) {
      console.error("Error submitting settings:", error);
    }
  };

  return (
    <div className="revWaitCompo">
      <div className="accinfo-bigtext">예약 및 웨이팅 설정</div>
      <div className="rest-revwait">
        <label className="accinfo-checkbox-forrev">
          <input
            type="checkbox"
            name="rev"
            value="예약"
            checked={isReservationChecked}
            onChange={handleReservationChange}
          />
          예약
        </label>
        {isReservationChecked && (
          <div className="accinfo-rev-detail">
            <div className="accinfo-bigtext">예약 설정</div>
            <div className="revSetting-first">
              <div className="Wrppaerforinput">
                <div className="accinfo-hintText">예약 오픈 단위</div>
                <Select
                  options={revunitOptions}
                  value={revunit}
                  onChange={handleRevunitChange}
                  placeholder="예약 유형 선택"
                  className="select-box-revdetail"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="Wrppaerforinput">
                <div className="accinfo-hintText">예약 간격</div>
                <Select
                  options={revperiodOptions}
                  value={revperiod}
                  onChange={handleRevperiodChange}
                  placeholder="기간 선택"
                  className="select-box-revdetail"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="Wrppaerforinput">
                <div className="accinfo-hintText">시간별 예약 최대 인원</div>
                <input
                  type="number"
                  placeholder="숫자로 입력해주세요"
                  className="accinfo-plain-input-rev"
                  value={inputMaxGuests}
                  onChange={(e) => setInputMaxGuests(e.target.value)}
                />
              </div>
              <div className="Wrppaerforinput">
                <div className="accinfo-hintText">시간별 예약 최대 테이블 수</div>
                <input
                  type="number"
                  placeholder="숫자로 입력해주세요"
                  className="accinfo-plain-input-rev"
                  value={inputMaxTables}
                  onChange={(e) => setInputMaxTables(e.target.value)}
                />
              </div>
            </div>
            <div className="revSetting-second">
              <div className="accinfo-hintText">예약금</div>
              <div className="revMoneyCheckboxWrapper">
                <label className="ccinfo-checkbox">
                  <input
                    type="checkbox"
                    name="reservationFee"
                    value="custom"
                    checked={reservationFee === "A"}
                    onChange={handleReservationFeeChange}
                  />
                  제가 예약금을 지정하겠습니다.
                </label>
                {reservationFee === "A" && (
                  <input
                    type="number"
                    className="inputformoney"
                    placeholder="30,000"
                    value={reservationCustomFee}
                    onChange={(e) => setReservationCustomFee(e.target.value)}
                  />
                )}
                <label className="ccinfo-checkbox">
                  <input
                    type="checkbox"
                    name="reservationFee"
                    value="20%"
                    checked={reservationFee === "B"}
                    onChange={handleReservationFeeChange}
                  />
                  주문 메뉴의 20%를 예약금으로 받겠습니다.
                </label>
              </div>
            </div>
            <PeakSeason restId={restId} />
          </div>
        )}
        <label className="accinfo-checkbox-forrev">
          <input
            type="checkbox"
            name="wait"
            value="줄서기"
            checked={isWaitChecked}
            onChange={handleWaitChange}
          />
          원격줄서기
        </label>
      </div>
      <div className="editCompleteBtnWrapper">
        <button className="ediCompleteBrn" onClick={handleSubmit}>
          수정 완료
        </button>
      </div>
    </div>
  );
}

export default RevWaitSetting;
