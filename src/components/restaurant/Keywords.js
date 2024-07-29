import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Trash from "../../assets/images/Restaurant/recycle-bin.png"; // 삭제 아이콘

function Keywords({ restId }) {
  const [allKeywords, setAllKeywords] = useState([]);
  const [selectedKeyword, setSelectedKeyword] = useState(null);
  const [currentKeywords, setCurrentKeywords] = useState([]);

  // 모든 키워드를 불러오는 함수
  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const response = await axios.get("${process.env.REACT_APP_API_URI}/api/keywords");
        const keywords = response.data;
        const formattedKeywords = keywords.map((keyword) => ({
          value: keyword.keywordId,
          label: keyword.keyword,
        }));
        setAllKeywords(formattedKeywords);
      } catch (error) {
        console.error("키워드 가져오기 오류:", error);
      }
    };
    fetchKeywords();
  }, []);

  // 현재 식당에 등록된 키워드를 불러오는 함수
  useEffect(() => {
    const fetchCurrentKeywords = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URI}/api/keywords/${restId}`);
        const keywords = response.data;
        setCurrentKeywords(keywords);
      } catch (error) {
        console.error("현재 키워드 가져오기 오류:", error);
      }
    };
    fetchCurrentKeywords();
  }, [restId]);

  // 현재 등록된 키워드 목록을 제외한 키워드 목록을 반환
  const getAvailableKeywords = () => {
    const currentKeywordIds = new Set(currentKeywords.map(keyword => keyword.keywordId));
    return allKeywords.filter(keyword => !currentKeywordIds.has(keyword.value));
  };

  // 현재 등록된 키워드 수에 따라 버튼 활성화 여부 결정
  const isEnrollButtonDisabled = currentKeywords.length >= 3;

  const handleKeywordChange = (selectedOption) => {
    setSelectedKeyword(selectedOption);
  };

  const handleEnroll = async () => {
    if (!selectedKeyword) {
      alert("키워드를 선택해주세요.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URI}/api/keywords/${selectedKeyword.value}/rest/${restId}`);
      // 키워드 등록 후 현재 키워드를 다시 가져와서 업데이트
      const response = await axios.get(`${process.env.REACT_APP_API_URI}/api/keywords/${restId}`);
      const keywords = response.data;
      setCurrentKeywords(keywords);
      setSelectedKeyword(null)
    } catch (error) {
      console.error("키워드 등록 오류:", error);
    }
  };

  const handleDelete = async (keywordId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URI}/api/keywords/${keywordId}/rest/${restId}`);
      // 키워드 삭제 후 현재 키워드를 다시 가져와서 업데이트
      const response = await axios.get(`${process.env.REACT_APP_API_URI}/api/keywords/${restId}`);
      const keywords = response.data;
      setCurrentKeywords(keywords);
    } catch (error) {
      console.error("키워드 삭제 오류:", error);
    }
  };

  return (
    <div className="keywordWrapper">
      <div className="accinfo-bigtext">키워드</div>
      <div className="keyWrapperUpper">
        
        <div className="Wrppaerforinput keywordWrapperforSelect">
          <div className="accinfo-hintText">키워드 등록(최대 3개만 가능합니다)</div>
          <Select
            options={getAvailableKeywords()}  // 필터링된 키워드 목록 사용
            value={selectedKeyword}
            onChange={handleKeywordChange}
            placeholder="키워드 검색/등록"
            className="select-box-keyword"
            classNamePrefix="react-select"
          />
        </div>
        <button
          className="accinfo-button-keyword"
          onClick={handleEnroll}
          disabled={isEnrollButtonDisabled} // 버튼 비활성화 설정
        >
          키워드 등록
        </button>
      </div>
      <div className="keyworditemsWrapper">
        {currentKeywords.map((keyword) => (
          <div key={keyword.keywordId} className="keyword-item">
            <div>{keyword.keyword}</div>
            <img
              src={Trash}
              alt="Delete"
              className="TrashcanImg"
              onClick={() => handleDelete(keyword.keywordId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Keywords;
