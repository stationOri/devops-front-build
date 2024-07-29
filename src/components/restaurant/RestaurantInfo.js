import axios from 'axios';
import React, { useState, useEffect } from "react";
import "../../css/components/restaurant/RestaurantInfo.css";
import "../../css/pages/RestDetailPage.css";
import Loading from "../Loading";
import StarRatings from "../../components/StarRatings";
import RestaurantLocationMap from "../../components/RestaurantLocationMap";
import ReviewCard from "../../components/ReviewCard";
import InputModal from "../Modal/InputModal";
import { useInputModal } from "../Modal/InputModalContext";

import rightImg from "../../assets/images/detail/right.png";
import leftImg from "../../assets/images/detail/left.png";
import locationImg from "../../assets/images/detail/location.png";
import opentimeImg from "../../assets/images/detail/opentime.png";
import phoneImg from "../../assets/images/detail/phone.png";
import quotesImg1 from "../../assets/images/detail/quotes.png";
import quotesImg2 from "../../assets/images/detail/quotes2.png";
import NoticeModal from "../Modal/NoticeModal";

function RestaurantInfo({ onMenuEditClick, onInfoEditClick, restId }) {
  const [noticeshow, setNoticeshow] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [opentimes, setOpentimes] = useState([]);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isopenContent, setIsOpenContent] = useState(false)
  const reviewsPerPage = 4;

  const [noticeSuccess, setNoticeSuccess] = useState(false);
  const NoticeClose = () => setNoticeshow(false);
  const NoticeShow = () => setNoticeshow(true);

  const { openInputModal } = useInputModal();

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

  const handleMenuEditClick = () => {
    onMenuEditClick("메뉴 관리");
  };

  const handleReviewReportClick = (reviewId) => {
    console.log("리뷰 신고 버튼 클릭됨, 리뷰 ID:", reviewId);
    openInputModal({
      show: true,
      header: "리뷰 신고",
      reviewId: reviewId,
    });
  };

const handelIsopen = async () => {
  try {
    const temp = !isopenContent; 
    const response = await axios.put(`${process.env.REACT_APP_API_URI}/api/restaurants/info/isopen/${restId}/${temp}`, {

    });

    if(response.data === true) {
      alert("영업이 시작되었습니다.")
    }
    if(response.data === false) {
      alert("영업이 종료되었습니다.")
    }

    setIsOpenContent(response.data);

  } catch (error) {
    console.error(error);
    setError(error.message); 
  }
}

  

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchIsopen(),
          fetchRestaurant(),
          fetchOpentimes(),
          fetchMenus(),
          fetchReviews(),
        ]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [restId, noticeSuccess]);

  const fetchIsopen = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/restaurants/info/isopen/${restId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch isopen status");
      }
      setIsOpenContent(response.data)
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/restaurants/${restId}`);
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
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/review/rest/${restId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
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
    <div className="rest-owner-info-container">
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
          <div className="rest-mod-btn-box">
          <div className="mod-btn" onClick={handelIsopen}>
              <div className="mod-btn-content">{isopenContent?"영업 종료":"영업 시작"}</div>
            </div>
            <div className="mod-btn" onClick={() => onInfoEditClick(restId)}>
              <div className="mod-btn-content">식당 정보 수정</div>
            </div>
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
        <div className="rest-mod-btn-wrap">
          <div className="rest-title">Announcement</div>
          <div className="rest-mod-btn-box">
            <div className="mod-btn" onClick={NoticeShow}>
              <div className="mod-btn-content">공지 수정</div>
            </div>
          </div>
        </div>
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
        <div className="rest-mod-btn-wrap">
          <div className="rest-title">Menu</div>
          <div className="rest-mod-btn-box">
            <div className="mod-btn" onClick={handleMenuEditClick}>
              <div className="mod-btn-content">메뉴 수정</div>
            </div>
          </div>
        </div>
        <div>
          <div className="menu-container">
            {menus.map((menu) => (
              <li key={menu.menuId} className="menu-li">
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
              <img className="rest-info-img" src={locationImg} alt=""/>
              <p className="rest-info-content">{restaurant.restAddress}</p>
            </div>
            <div className="rest-info-wrap-2">
              <img className="rest-info-img" src={opentimeImg} alt=""/>
              <div>
                {opentimes.map((opentime) => (
                  <div key={opentime.id} className="rest-info-content">
                    {opentime.restDay} : {opentime.restOpen} ~{" "}
                    {opentime.restClose} / 브레이크타임 :{" "}
                    {opentime.restBreakstart} ~ {opentime.restBreakend}
                  </div>
                ))}
              </div>
            </div>
            <div className="rest-info-wrap">
              <img className="rest-info-img" src={phoneImg} alt=""/>
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
            <img className="review-pagination-img" src={leftImg} alt=""/>
          </div>
          <div className="rest-review-container">
            {currentReviews.length === 0 ? (
              <div className="rest-no-review">리뷰가 없습니다</div>
            ) : (
              currentReviews.map((review) => (
                <div className="rest-review-report-box">
                  <ReviewCard key={review.reviewId} review={review} />
                  <div className="rest-mod-btn-box">
                    <div
                      className="mod-btn"
                      onClick={() => handleReviewReportClick(review.reviewId)}
                    >
                      <div className="mod-btn-content">리뷰 신고</div>
                    </div>
                  </div>
                </div>
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
            <img className="review-pagination-img" src={rightImg} alt=""/>
          </div>
        </div>
      </div>
      <InputModal />
      <NoticeModal NoticeClose={NoticeClose} noticeshow={noticeshow} restId={restId} onSuccess={() => setNoticeSuccess(true)}/>
    </div>
  );
}

export default RestaurantInfo;
