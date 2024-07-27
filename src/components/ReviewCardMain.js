import React, { useState } from "react";
import "../css/components/ReviewCard.css";
import StarRatings from "./StarRatings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import StarRatingsCarousel from "./user/StarRatingCarousel";

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const reviewContent = review.reviewData;
  const isLongText = reviewContent.length > 30;

  return (
    <div className="review-card-container">
      <StarRatingsCarousel rating={review.reviewGrade} />
      <div className="review-card-boxformain">
        <div className="review-data-boxformain">
          <p>
            {isExpanded ? reviewContent : 
              isLongText ? `${reviewContent.substring(0, 30)}...` : reviewContent}
            {isLongText && (
              <span className="read-more" onClick={toggleReadMore}>
                {isExpanded ? " Show less" : " Read more"}
              </span>
            )}
          </p>
        </div>
        <div className="review-info-box">
          <p className="reviewer-namemain">{review.userNickname}</p>
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