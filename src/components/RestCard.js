import React, { useMemo } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import "../css/components/RestCard.css";

const RestCard = ({
  userId,
  restId,
  img,
  RestName,
  RestAddress,
  RestOpentimes,
  keyword1,
  keyword2,
  keyword3,
  isFavorite,
  toggleFavorite,
  onCardClick,
}) => {
  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(restId, !isFavorite);
    console.log(isFavorite);
  };

  const uniqueOpentimes = useMemo(() => {
    const uniqueTimes = Array.from(
      new Map(RestOpentimes.map(item => [item.restDay, item])).values()
    );
    return uniqueTimes;
  }, [RestOpentimes]);

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

  return (
    <div className="rest-card-container">
      <div className="rest-card" onClick={onCardClick}>
        <div className="rest-card-img-box">
          <img className="rest-card-img" src={img} alt="restaurantImg" />
        </div>
        <div className="rest-card-info">
          <div className="rest-card-name">{RestName}</div>
          <div className="rest-card-address">{RestAddress}</div>
          <div className="rest-card-opentimes">
            {uniqueOpentimes&&uniqueOpentimes.map((opentime, index) => (
              <div key={index}>
                <div className="rest-card-opentime">
                  {convertDayToKorean(opentime.restDay)}: {opentime.restOpen} - {opentime.restClose}
                </div>
              </div>
            ))}
          </div>
          <div className="rest-card-key-heart">
            <div className="rest-card-keyword">
              <span className="rest-keyword">#{keyword1} </span>
              <span className="rest-keyword">#{keyword2} </span>
              <span className="rest-keyword">#{keyword3} </span>
            </div>
            <div className="favorite-btn" onClick={handleFavorite}>
              {isFavorite ? (
                <FaHeart className="favorited-icon" />
              ) : (
                <FaRegHeart className="favorited-icon" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestCard;