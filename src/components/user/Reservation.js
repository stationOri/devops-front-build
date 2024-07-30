import React, { useState, useEffect } from "react";
import "../../css/pages/Reservation.css";
import Loading from "../../components/Loading";
import RestaurantLocationMap from "../../components/RestaurantLocationMap";
import DatePicker from "react-datepicker";
import { subDays } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import locationImg from "../../assets/images/detail/location.png";
import opentimeImg from "../../assets/images/detail/opentime.png";
import phoneImg from "../../assets/images/detail/phone.png";
import noteImg from "../../assets/images/detail/note.png";
import calImg from "../../assets/images/modal/cal.png";
import pplImg from "../../assets/images/modal/people.png";

const Reservation = ({ userId, restId, setSelectedMenu}) => {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [opentimes, setOpentimes] = useState([]);
  const [restInfo, setRestInfo] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [menuQuantities, setMenuQuantities] = useState({});
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [reqText, setReqText] = useState("");
  const [peak, setPeak] = useState([]);
  const [holiday, setHoliday] = useState([]);

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
    fetchRestaurant();
    fetchOpentimes();
    fetchRestInfo();
    fetchMenus();
    fetchHoliday();
    fetchPeak();
  }, [restId]);

  const handlesuccess = () => {
    setSelectedMenu("마이페이지")
  }

  useEffect(() => {
    if (menus.length > 0) {
      const initialQuantities = menus.reduce((acc, menu) => {
        acc[menu.menuId] = 0;
        return acc;
      }, {});
      setMenuQuantities(initialQuantities);
    }
  }, [menus]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant");
      }
      const data = await response.json();
      setRestaurant(data);
      console.log(restaurant);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOpentimes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/opentime/${restId}`);
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

  const fetchMenus = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/menu/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAvailableTimes = async (date) => {
    try {
      const formattedDate = toKoreanDateString(new Date(date)); // 날짜를 KST로 변환
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/reservations/${restId}/times/${formattedDate}`
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

      setAvailableTimes(data.availabilityMap[formattedDate]);
    } catch (error) {
      console.error("사용 가능한 시간 가져오기 오류:", error);
    }
  };

  const fetchRestInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/info/res/${restId}`
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

  const fetchHoliday = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/rest-temp-holiday/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch holiday");
      }
      const data = await response.json();
      console.log("holiday: ", data);
      setHoliday(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchPeak = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/peak/${restId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch peak");
      }
      const data = await response.json();
      setPeak(data);
      console.log("peak: ", data);
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

  const handleGuestsChange = (event) => {
    setSelectedGuests(event.target.value);
  };

  const oneWeekLater = new Date(new Date().setDate(new Date().getDate() + 7));
  const oneMonthLater = new Date(new Date().setDate(new Date().getDate() + 30));

  const LaterDate =
    restInfo && restInfo.restReserveopenRule === "WEEKS"
      ? oneWeekLater
      : oneMonthLater;

  const handleMenuIncrement = (menuId) => {
    setMenuQuantities((prevQuantities) => ({
      ...prevQuantities,
      [menuId]: prevQuantities[menuId] + 1,
    }));
  };

  const handleMenuDecrement = (menuId) => {
    setMenuQuantities((prevQuantities) => ({
      ...prevQuantities,
      [menuId]: prevQuantities[menuId] > 1 ? prevQuantities[menuId] - 1 : 0,
    }));
  };

  const checkMenuSelected = () => {
    let menuSelected = false;
    menus.forEach((menu) => {
      if (menuQuantities[menu.menuId] > 0) {
        menuSelected = true;
      }
    });
    return menuSelected;
  };

  const calculateTotalPrice = () => {
    return menus.reduce((total, menu) => {
      return total + menu.menuPrice * (menuQuantities[menu.menuId] || 0);
    }, 0);
  };

  const handleCheckboxChange = (event) => {
    setCheckBoxChecked(event.target.checked);
  };

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

  const handleEnrollReservation = async (e) => {
    e.preventDefault();
    const menulist = menus
      .filter((menu) => menuQuantities[menu.menuId] > 0)
      .map((menu) => ({
        menuId: menu.menuId,
        amount: menuQuantities[menu.menuId],
      }));

    let depositAmount;
    if (restInfo && restInfo.restDepositMethod === "A") {
      depositAmount = restInfo.restDeposit * selectedGuests;
    } else {
      depositAmount = calculateTotalPrice() * 0.2;
    }
    const reservationReqDto = {
      restId,
      userId,
      selectedTime,
      selectedDate: toKoreanDateString(selectedDate),
      resNum: selectedGuests,
      deposit: depositAmount,
      request: reqText,
      menulist,
    };

    try {
      console.log(menulist);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URI}/api/reservations/reservationcheck`,
        reservationReqDto,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data === "available") {
        PaymentRequest(depositAmount, userId, reservationReqDto);
      } else {
        alert(response.data);
      }
    } catch (error) {
      console.error("Error making reservation:", error);
    }
  };

  const PaymentRequest = (amount, userId, reservationReqDto, setSelectedMenu) => {
  const { IMP } = window;
  IMP.init("imp50204728"); // 가맹점 번호 지정
  IMP.request_pay(
    {
      pg: "tosspayments",
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}_${userId}`,
      name: "waitmate 예약금",
      amount: amount,
      buyer_name: userId,
    },
    async (response) => {
      if (response.error_code != null) {
        return alert(
          `결제에 실패하였습니다. 에러 내용: ${response.error_msg}`
        );
      } else {
        try {
          const notified = await axios.post(
            `${process.env.REACT_APP_API_URI}/api/payment/validation`,
            {
              imp_uid: response.imp_uid,
              merchant_uid: response.merchant_uid,
              amount: parseInt(amount),
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (notified) {
            console.log("결제 verification 성공");
            const payDto = {
              imp_uid: response.imp_uid,
              merchant_uid: response.merchant_uid,
              amount: parseInt(amount),
            };
            const combinedDto = {
              reservationReqDto: reservationReqDto,
              payDto: payDto,
            };
            try {
              const reservationResponse = await axios.post(
                `${process.env.REACT_APP_API_URI}/api/reservations/reservation`,
                combinedDto,
                {
                  headers: { "Content-Type": "application/json" },
                }
              );
              if (reservationResponse.data === "success") {
                alert("예약 성공!");
                handlesuccess();
              } else {
                alert(reservationResponse.data);
              }
            } catch (error) {
              console.error("Error making reservation:", error);
            }
          } else {
            alert("결제 실패");
            console.log("결제 verification 실패");
          }
        } catch (error) {
          alert("결제 화면 호출 실패");
          console.error("api 호출 실패:", error);
        }
      }
    }
  );
};

const getExcludeDateIntervals = (holiday, peak) => {
  const now = new Date();

  return [
    ...holiday?.map((exclude) => ({
      start: subDays(new Date(exclude.startDate), 1),
      end: new Date(exclude.endDate),
    })),
    ...peak?.map((exclude) => {
      const peakOpenDate = new Date(exclude.peakOpendate);
      console.log("now: ", now);
      console.log("peakOpenDate: ", peakOpenDate);
      if (now < peakOpenDate) {
        return {
          start: subDays(new Date(exclude.dateStart), 1),
          end: new Date(exclude.dateEnd),
        };
      } else {
        return null;
      }
    }).filter(Boolean), 
  ];
};

const excludeDateIntervals = getExcludeDateIntervals(holiday, peak);

  return (
    <div className="reservation">
      <div className="res-container">
        <div className="rest-photo-map">
          <div className="res-rest-photo">
            <img
              className="rest-photo"
              src={restaurant?.restPhoto}
              alt={restaurant?.restName}
            />
          </div>
          <div className="res-map">
            <RestaurantLocationMap address={restaurant?.restAddress} />
          </div>
        </div>
        <div className="res-rest-content">
          <div className="rest-info-box">
            <div className="rest-name-box">
              <div className="rest-name">{restaurant?.restName}</div>
              <div className="res-rest-keyword">
                <span className="rest-keyword">#{restaurant?.keyword1} </span>
                <span className="rest-keyword">#{restaurant?.keyword2} </span>
                <span className="rest-keyword">#{restaurant?.keyword3} </span>
              </div>
            </div>
            <div className="res-horizon"></div>
            <div className="res-rest-intro-box flex-row">
              <div className="res-rest-location-wrap">
                <div className="rest-info-wrap">
                  <img className="rest-info-img" src={locationImg} alt="" />
                  <p className="rest-info-content">{restaurant?.restAddress}</p>
                </div>
                <div className="rest-info-wrap-2">
                  <img
                    className="rest-info-img mt-5"
                    src={opentimeImg}
                    alt=""
                  />
                  <div>
                    {opentimes.map((opentime) => (
                      <div
                        key={opentime.restaurantOpenId}
                        className="rest-info-content"
                      >
                        {opentime.restDay} : {opentime.restOpen} ~{" "}
                        {opentime.restClose}/ 브레이크타임 :{" "}
                        {opentime.restBreakstart} ~ {opentime.restBreakend}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rest-info-wrap">
                  <img className="rest-info-img" src={phoneImg} alt="" />
                  <p className="rest-info-content">{restaurant?.restPhone}</p>
                </div>
              </div>
              <div className="res_rest_intro">
                <div className="rest-info-wrap-2">
                  <img className="rest-info-img mt-5" src={noteImg} alt="" />
                  <div className="rest-info-content">
                    {restaurant?.restIntro}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="res-enroll-date-time">
            <div className="res-enroll-date">
              <img className="res-cal-img" src={calImg} alt="" />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
                maxDate={LaterDate}
                className="picker"
                placeholderText="DATE"
                dateFormat="yyyy-MM-dd"
                excludeDateIntervals={excludeDateIntervals}
              />
            </div>
            <div className="res-enroll-ppl">
              <img className="res-ppl-img" src={pplImg} alt="" />
              {restInfo && restInfo.maxPpl ? (
                <select
                  id="guestPicker"
                  className="picker"
                  value={selectedGuests}
                  onChange={handleGuestsChange}
                >
                  {[...Array(restInfo.maxPpl)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Loading guests info...</p>
              )}
            </div>
            <div className="res-deposit-method-info">
              {restInfo
                ? restInfo.restDepositMethod === "A"
                  ? `지정액 인당 ${restInfo.restDeposit}원`
                  : `메뉴 20%.`
                : "0원"}
            </div>
          </div>
          <div>
            <div className="res-sub-title">Available Time Slots</div>
            <div className="res-btn-container">
              {availableTimes ? (
                Object.entries(availableTimes).map(([time, available]) => (
                  <div
                    className={`res-time-btn ${
                      selectedTime === time ? "selected" : ""
                    } ${!available ? "disabled" : ""}`}
                    key={time}
                    onClick={() => available && handleTimeClick(time)}
                  >
                    <div className="res-btn-content">{time}</div>
                  </div>
                ))
              ) : (
                <p>No available times for the selected date.</p>
              )}
            </div>
          </div>
          <div>
            <div className="res-sub-title sub-title-margin">Menu</div>
            <div className="res-menu-container">
              {menus.map((menu) => (
                <li key={menu.menuId} className="res-menu-li">
                  <div className="res-menu-box">
                    <img
                      className="res-menu-img"
                      src={menu?.menuPhoto}
                      alt={menu?.menuName}
                    />
                    <div className="res-menu-info-box">
                      <div className="res-menu-title">{menu?.menuName}</div>
                      <div className="res-menu-price">{menu?.menuPrice}원</div>
                      <div className="menu-quantity-controls">
                        <button
                          className="menu-picker-btn-minus"
                          onClick={() => handleMenuDecrement(menu?.menuId)}
                        >
                          -
                        </button>
                        <span>{menuQuantities[menu?.menuId]}</span>
                        <button
                          className="menu-picker-btn-plus"
                          onClick={() => handleMenuIncrement(menu?.menuId)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </div>
          <div>
            <div className="res-sub-title">Total</div>
            <div className="res-total-container">
              {menus.map(
                (menu) =>
                  menuQuantities[menu.menuId] > 0 && (
                    <div
                      key={menu.menuId}
                      className={`res-total-item ${
                        menu.menuId % 2 === 0 ? "even-item" : "odd-item"
                      }`}
                    >
                      <table className="menu-table">
                        <tbody>
                          <tr>
                            <td className="res-menu-name">{menu.menuName}</td>
                            <td className="res-menu-quan">
                              X {menuQuantities[menu.menuId]}
                            </td>
                            <td className="res-menu-money">
                              {menu.menuPrice * menuQuantities[menu.menuId]} 원
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )
              )}
              <br />
              <div className="res-total-price">
                Total : {calculateTotalPrice()} 원
              </div>
            </div>
          </div>
          <div>
            <div className="res-sub-title sub-title-margin">요청 사항</div>
            <div className="res-req">
              <textarea
                className="custom_textarea"
                value={reqText}
                onChange={(e) => setReqText(e.target.value)}
              />
            </div>
          </div>
          <div className="res-horizon" />
          <div className="res-to-pay-container">
            <div className="res-pay-info">
              <div className="res-pay-info-total">
                예약금{" "}
                {restInfo
                  ? restInfo.restDepositMethod === "A"
                    ? `${restInfo.restDeposit * selectedGuests} 원`
                    : `${
                        Math.floor((calculateTotalPrice() * 0.2))
                      } 원`
                  : "0원"}
              </div>
              <div className="res-refund-rule">
                아래는 예약 취소에 관련된 규정 사항입니다. 단순 변심에 따른
                취소는 불가능 하오니 확인하시고 체크 해주시길 바랍니다.
              </div>
              <div className="res-refund-rule">
                <div>
                  <span className="refund-info">~ 이용 7일 전까지 </span> 예약금
                  전액 환불
                </div>
                <div>
                  <span className="refund-info">~ 이용 3일 전까지 </span> 예약금
                  50% 차감 환불
                </div>
                <div>
                  <span className="refund-info">~ 이용 1일 전까지 </span> 예약금
                  90% 차감 환불
                </div>
                <div>그 이후 취소 불가</div>
              </div>
              <div className="res-check">
                <input
                  type="checkbox"
                  checked={checkBoxChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="res-refund-rule">
                  위 내용을 확인 했습니다.
                </span>
              </div>
            </div>
          </div>
          <div className="btn-center">
            <div className="res-enroll-btn">
              <div
                className={`res-btn-content ${
                  checkBoxChecked &&
                  selectedDate &&
                  selectedTime &&
                  menus.length > 0 &&
                  checkMenuSelected()
                    ? ""
                    : "disabled"
                }`}
                onClick={handleEnrollReservation}
              >
                결제
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
