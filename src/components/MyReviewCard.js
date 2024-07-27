import React, { useState } from "react";
import "../css/components/MyReviewCard.css";
import StarRatings from "./StarRatings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const MyReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const reviewContent = review.reviewData;
  const isLongText = reviewContent.length > 105;

  return (
    <div className="my-review-card-container">
      <StarRatings rating={review.reviewGrade} />
      <div className="my-review-card-box">
        <div className="my-review-img-box">
          <img className="my-review-img" src={review.reviewImg} alt="review" />
          <img className="my-review-img" src={review.reviewImg2} alt="review" />
          <img className="my-review-img" src={review.reviewImg3} alt="review" />
        </div>
        <div className="my-review-data-info-box">  
        <div className="my-review-data-box">
          <p>
            {isExpanded ? reviewContent : 
              isLongText ? `${reviewContent.substring(0, 103)}...` : reviewContent}
            {isLongText && (
              <span className="read-more" onClick={toggleReadMore}>
                {isExpanded ? " Show less" : " Read more"}
              </span>
            )}
          </p>
        </div>
        <div className="my-review-info-box">
          <p className="my-reviewer-name">{review.userNickname}</p>
          <div className="my-review-like-box">
            <button className="my-button-like">
              <div className="my-review-like-btn">
                <FontAwesomeIcon className="fa" icon={faThumbsUp} />
                <span>Likes</span>
                <span>{review.likeNum}</span>
              </div>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MyReviewCard;