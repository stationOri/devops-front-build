import React, { useState, useRef } from 'react';
import axios from 'axios';
import Logo from "../../assets/images/oriblue.png";
import "../../css/components/Modal/ReviewModal.css";
import FileReview from "../FileReview";

function ReviewModal({ ReviewClose, reviewshow, userId, restId, onReviewSuccess }) {
  const [contents, setContents] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const fileRef = useRef(null);

  const handleEditActivate = async () => {
    const files = fileRef.current.getFiles();

    if (files.length === 0 && !contents.trim()) {
      alert("리뷰 내용과 이미지를 추가해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("restId", restId);
    formData.append("reviewData", contents);
    formData.append("reviewGrade", rating);

    if (files.length > 0) formData.append("file", files[0]);
    if (files.length > 1) formData.append("file2", files[1]);
    if (files.length > 2) formData.append("file3", files[2]);

    try {
      const response = await axios.post("${process.env.REACT_APP_API_URI}/api/review/review", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data > 0) {
        alert('리뷰가 성공적으로 등록되었습니다.');
        onReviewSuccess();
      } else {
        alert('리뷰 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error("Error uploading review:", error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setContents("");
      fileRef.current.reset();
      setRating(0);
      ReviewClose();
    }
  };

  const handleStarClick = (index) => {
    const newRating = index + 1;
    setRating(newRating);
  };

  const handleMouseEnter = (index) => {
    setHover(index + 1);
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  const handleReviewClose = () => {
    setContents("");
    fileRef.current.reset();
    setRating(0);
    ReviewClose();
  };

  return (
    <div
      id={reviewshow ? "signinbackgroundon" : "signinbackgroundoff"}
      onClick={(e) => {
        if (
          e.target.id === "signinbackgroundon" ||
          e.target.id === "signinbackgroundoff"
        ) {
          handleReviewClose();
        }
      }}
    >
      <div className={`signinModal ${reviewshow ? "signinshow" : "signinhide"}`}>
        <div className="signinModalHeader">
          <img src={Logo} alt="Logo" className="signinori"/>
          <button className='signinclosebtn' onClick={handleReviewClose}>
            X
          </button>
        </div>
        <div className="signinModalContent">
          <div className="signinboldText">리뷰 등록</div>
          <div className="signinhintText">악성 리뷰 작성 시, 블라인드 처리될 수 있습니다.</div>
        </div>
        <div className='starRatingWrapper'>
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={`star ${index + 1 <= (hover !== null ? hover : rating) ? 'filled' : ''}`}
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              ★
            </span>
          ))}
        </div>
        <div className='inputBoxinNickname'>
          <div className='NicknameHinttest'>리뷰 내용</div>
          <textarea
            type='text'
            className='reviewinputBox'
            placeholder='최대 500자까지 작성 가능합니다.'
            maxLength={500}
            value={contents}
            onChange={(e) => setContents(e.target.value)}
          />
        </div>
        <div className='files'>
          <FileReview ref={fileRef} />
        </div>
        <div className="signinModalButton">
          <button className="signinModalPersonal" onClick={handleEditActivate}>등록</button>
          <button className="signinModalRest" onClick={handleReviewClose}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;