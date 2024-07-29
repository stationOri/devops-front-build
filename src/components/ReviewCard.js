import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/components/ReviewCard.css";
import StarRatings from "./StarRatings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

const ReviewCard = ({ review, userId, restId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loggedin, setLoggedin] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeNum, setLikeNum] = useState(review.likeNum);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (userId !== "") {
      setLoggedin(true);
    }
  }, [userId]);

  useEffect(() => {
    setLiked(review.likedByUser);
  }, [review.likedByUser]);

  const handleLikes = async () => {
    if (loggedin) {
      try {
        if (liked) {
          await axios.delete(`http://waitmate.shop/api/review/review/${review.reviewId}`);
          setLiked(false);
          setLikeNum(likeNum - 1);
          console.log(liked, likeNum)
        } else {
          await axios.post(`http://waitmate.shop/api/review/likes/review/${review.reviewId}/user/${userId}`);
          setLiked(true);
          setLikeNum(likeNum + 1);
          console.log(liked, likeNum)
        }
      } catch (error) {
        console.error("Error updating likes", error);
      }
    } else {
      alert("좋아요를 하시려면 로그인을 해주세요.");
    }
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
            {isExpanded
              ? reviewContent
              : isLongText
              ? `${reviewContent.substring(0, 86)}...`
              : reviewContent}
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
            <button className="button-like" onClick={handleLikes}>
              <div
                className={`review-like-btn ${liked ? "liked" : ""}`}
              >
                <FontAwesomeIcon className="fa" icon={faThumbsUp} />
                <span>Likes</span>
                <span>{likeNum}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
