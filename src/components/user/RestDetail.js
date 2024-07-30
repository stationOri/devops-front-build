import React, { useState, useEffect } from "react";
import "../../css/pages/RestDetailPage.css";
import Loading from "../../components/Loading";
import StarRatings from "../../components/StarRatings";
import RestaurantLocationMap from "../../components/RestaurantLocationMap";
import ReviewCard from "../../components/ReviewCard";
import rightImg from "../../assets/images/detail/right.png";
import leftImg from "../../assets/images/detail/left.png";
import locationImg from "../../assets/images/detail/location.png";
import opentimeImg from "../../assets/images/detail/opentime.png";
import phoneImg from "../../assets/images/detail/phone.png";
import emptyImg from "../../assets/images/detail/empty.png";
import quotesImg1 from "../../assets/images/detail/quotes.png";
import quotesImg2 from "../../assets/images/detail/quotes2.png";
import EmptyEnrollModal from "../../components/Modal/EmptyEnrollModal";
import WaitingEnrollModal from "../../components/Modal/WaitingEnrollModal";
import SelectReceiverModal from "../../components/Modal/SelectReceiverModal";
import axios from "axios";

const RestDetail = ({ userId, restId, moveToReservation }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [opentimes, setOpentimes] = useState([]);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWaitingModalOpen, setIsWaitingModalOpen] = useState(false);
  const [isReceiverModalOpen, setIsReceiverModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isopen, setIsOpen] = useState(false);
  const reviewsPerPage = 4;

  const openModal = () => {
    if (userId !== 0) {
      setIsModalOpen(true);
    } else {
      alert("빈자리 알림은 로그인을 하셔야 신청 가능합니다.")
    }
    
  };

  const openWaitingModal = () => {
    if (userId !== 0) {
      setIsWaitingModalOpen(true);
    } else {
      alert("웨이팅 등록은 로그인을 하셔야 가능합니다.")
    }
    
  };

  const openReceiverModal = () => {
    setIsReceiverModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsWaitingModalOpen(false);
    setIsReceiverModalOpen(false);
  };

  const moveFunc = () => {
    if(userId !== 0) {
      moveToReservation(restId);
    }else {
      alert("예약은 로그인을 해야 가능합니다.")
    }
    
  };

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
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchRestaurant(),
          fetchOpentimes(),
          fetchMenus(),
          fetchReviews(),
          fetchIsOpen()
        ]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [restId, userId]);

  const fetchIsOpen = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URI}/api/restaurants/isopen/${restId}`);
      
      if (response.status !== 200) {
        throw new Error("Failed to fetch isopen");
      }
      setIsOpen(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

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
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const fetchOpentimes = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/opentime/${restId}`
      );
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
      console.error("Error fetching opentimes:", error);
      setOpentimes([]);
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

  const fetchReviews = async () => {
    try {
      const url = userId
        ? `${process.env.REACT_APP_API_URI}/api/review/rest/${restId}/user/${userId}`
        : `${process.env.REACT_APP_API_URI}/api/review/rest/${restId}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      const filteredData = data.filter(review => !review.blind);
      setReviews(filteredData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  if (loading || !restaurant || error) {
    return <Loading />;
  }

  const paginate = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(reviews.length / reviewsPerPage)) {
      return;
    }
    setCurrentPage(newPage);
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  return (
    <div className="detail">
      <EmptyEnrollModal
        isOpen={isModalOpen}
        onClose={closeModal}
        userId={userId}
        restId={restId}
        name={restaurant.restName}
      />
      <WaitingEnrollModal
        isOpen={isWaitingModalOpen}
        onClose={closeModal}
        userId={userId}
        restId={restId}
        name={restaurant.restName}
      />
      <SelectReceiverModal
        isOpen={isReceiverModalOpen}
        onClose={closeModal}
        receiverId={restId}
        senderId={userId}
      />
      <div className="rest-container">
        <div className="rest-photo-box">
          <img
            className="rest-photo"
            src={restaurant.restPhoto}
            alt={restaurant.restName}
          />
        </div>
        <div className="rest-info-box">
          <div className="rest-name-box">
            <div className="rest-name">{restaurant.restName}</div>
            <div className="rest-btn-box">
              { isopen ? 
              <>
              <div className="empty-btn" onClick={openModal}>
              <img className="empty-img" src={emptyImg} alt="" />
              <div>빈자리 알림 요청</div>
            </div>
            <div className="ask-btn" onClick={openReceiverModal}>
              <div className="btn-content">1:1 문의</div>
            </div>
            {restaurant.revWait === "A" && (
              <div className="res-btn" onClick={openWaitingModal}>
                <div className="btn-content">웨이팅</div>
              </div>
            )}
            {restaurant.revWait === "B" && (
              <div className="res-btn" onClick={moveFunc}>
                <div className="btn-content">예약</div>
              </div>
            )}
            {restaurant.revWait === "C" && (
              <>
                <div className="res-btn" onClick={openWaitingModal}>
                  <div className="btn-content">웨이팅</div>
                </div>
                <div className="res-btn" onClick={moveFunc}>
                  <div className="btn-content">예약</div>
                </div>
              </>
            )}
            </>
            :<>
            <div className="notopenedmsg">식당이 예약 및 웨이팅 기능을 오픈하지 않았습니다.</div>
            </>
              }
              
            </div>
          </div>
          <div></div>
          <StarRatings rating={restaurant.restGrade} />
          <div className="rest-intro-box">
            <div>
              <span className="rest-keyword">#{restaurant.keyword1} </span>
              <span className="rest-keyword">#{restaurant.keyword2} </span>
              <span className="rest-keyword">#{restaurant.keyword3} </span>
            </div>
            <p>{restaurant.restIntro}</p>
          </div>
        </div>
        <div className="rest-box">
          <div className="rest-title">Announcement</div>
          <div className="rest-announce-box">
            <div className="quotes-img-container quotes-img-1">
              <img className="quotes-img" src={quotesImg1} alt="quote 1" />
            </div>
            <p>{restaurant.restPost}</p>
            <div className="quotes-img-container quotes-img-2">
              <img className="quotes-img" src={quotesImg2} alt="quote 2" />
            </div>
          </div>
        </div>
        <div className="rest-box">
          <div className="rest-title">Menu</div>
          <div>
            <div className="menu-container">
              {menus.map((menu) => (
                <li key={menu.id} className="menu-li">
                  <div className="menu-box">
                    <img
                      className="menu-img"
                      src={menu.menuPhoto}
                      alt={menu.menuName}
                    />
                    <div className="menu-info-box">
                      <p className="menu-title">{menu.menuName}</p>
                      <p className="menu-price">{menu.menuPrice}원</p>
                    </div>
                  </div>
                </li>
              ))}
            </div>
          </div>
        </div>
        <div className="rest-box">
          <div className="rest-title">Hours and Location</div>
          <div className="rest-location-box">
            <div className="rest-map">
              <RestaurantLocationMap address={restaurant.restAddress} />
            </div>
            <div className="rest-location-wrap">
              <div className="rest-info-wrap">
                <img className="rest-info-img" src={locationImg} alt="" />
                <p className="rest-info-content">{restaurant.restAddress}</p>
              </div>
              <div className="rest-info-wrap-2">
                <img className="rest-info-img" src={opentimeImg} alt="" />
                <div>
                  {opentimes.map((opentime) => (
                    <div key={opentime.id} className="rest-info-content">
                      {opentime.restDay} : {opentime.restOpen} ~{" "}
                      {opentime.restClose} / 브레이크타임 :{" "}
                      {opentime.restBreakstart || opentime.restBreakend
                        ? `${opentime.restBreakstart || "없음"} ~ ${
                            opentime.restBreakend || "없음"
                          }`
                        : "없음"}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rest-info-wrap">
                <img className="rest-info-img" src={phoneImg} alt="" />
                <p className="rest-info-content">{restaurant.restPhone}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="rest-box">
          <div className="rest-title">Reviews</div>
          <div className="rest-reviews-with-pagination">
            <div
              className="pagination-btn"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <img className="review-pagination-img" src={leftImg} alt="" />
            </div>
            <div className="rest-review-container">
              {currentReviews.length === 0 ? (
                <div className="rest-no-review">리뷰가 없습니다</div>
              ) : (
                currentReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    userId={userId}
                    restId={restId}
                  />
                ))
              )}
            </div>
            <div
              className="pagination-btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(reviews.length / reviewsPerPage)
              }
            >
              <img className="review-pagination-img" src={rightImg} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestDetail;
