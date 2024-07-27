import React, { useState, useEffect, useRef } from "react";
import "../../css/components/Modal/InputModal.css";

function NoticeModal({ NoticeClose, noticeshow, restId, onSuccess }) {
  const [NoticeInput, setNoticeInput] = useState("");

  const handleNoticeEdit = async (e) => {
    e.preventDefault();
    console.log(NoticeInput);

    const reportData = {
      restPost: NoticeInput,
    };

    try {
      const response = await fetch(
        `https://waitmate.shop/api/restaurants/info/notice/${restId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to post restaurant report");
      }

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : { restPost: "" };

      console.log("공지 수정 완료:", data);
      alert("공지가 성공적으로 수정되었습니다.");
      onSuccess();
      NoticeClose();
    } catch (error) {
      console.error("공지 수정 실패:", error);
      alert("공지 수정을 실패했습니다.");
    }
  };

  return (
    <div>
      <div
        id={noticeshow ? "checkbackgroundon" : "checkbackgroundoff"}
        onClick={(e) => {
          if (
            e.target.id === "checkbackgroundon" ||
            e.target.id === "checkbackgroundoff"
          ) {
            NoticeClose();
          }
        }}
      >
        <div className={`InputModal ${noticeshow ? "checkshow" : "checkhide"}`}>
          <div className="checkModalContent">
            <div className="InputboldText">공지사항 수정</div>
            <div className="InputhintText">
              가게 정보에 노출될 공지사항 설정
            </div>
            <div className="InputModalWrapper">
              <div className="inputhinttext">전달내용</div>
              <input
                type="text"
                className="reportinput"
                placeholder="최대 100자 까지 작성 가능합니다."
                maxLength={100}
                value={NoticeInput}
                onChange={(e) => setNoticeInput(e.target.value)}
              />
            </div>
            <div className="inputmodalbuttonWrapper">
              <button className="InputModalreport" onClick={handleNoticeEdit}>
                등록
              </button>
              <button className="InputModalCancel" onClick={NoticeClose}>
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeModal;
