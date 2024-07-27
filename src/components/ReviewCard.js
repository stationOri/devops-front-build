import React, { useState } from "react";
import "../css/components/ReviewCard.css";
import StarRatings from "./StarRatings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const reviewContent = review.reviewData;
  const isLongText = reviewContent.length > 105;

  return (
    <div className="review-card-container">
      <StarRatings rating={review.reviewGrade} />
      <div className="review-card-box">
        <div className="review-img-box">
          <img className="review-img" src={review.reviewImg} alt="review" />
          <img className="review-img" src={review.reviewImg2} alt="review" />
          <img className="review-img" src={review.reviewImg3} alt="review" />
        </div>
        <div className="review-data-box">
          <p className="review-data-text">
            {isExpanded ? reviewContent : 
              isLongText ? `${reviewContent.substring(0, 86)}...` : reviewContent}
            {isLongText && (
              <span className="read-more" onClick={toggleReadMore}>
                {isExpanded ? " Show less" : " Read more"}
              </span>
            )}
          </p>
        </div>
        <div className="review-info-box">
          <p className="reviewer-name">{review.userNickname}</p>
          <div className="review-like-box">
            <button className="button-like">
              <div className="review-like-btn">
                <FontAwesomeIcon className="fa" icon={faThumbsUp} />
                <span>Likes</span>
                <span>{review.likeNum}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;