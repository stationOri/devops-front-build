import React from 'react';
import { useCheckModal } from "./CheckModalContext";
import "../../css/components/Modal/CheckModal.css";

function CheckModal() {
  const { modalState, closeCheckModal } = useCheckModal();

  const { show, header, contents } = modalState;

  return (
    <div>
      <div
        id={show ? "checkbackgroundon" : "checkbackgroundoff"}
        onClick={(e) => {
          if (
            e.target.id === "checkbackgroundon" ||
            e.target.id === "checkbackgroundoff"
          ) {
            closeCheckModal();
          }
        }}
      >
        <div className={`checkModal ${show ? "checkshow" : "checkhide"}`}>
          <div className="checkModalContent">
            <div className="checkboldText">{header}</div>
            <hr className="checkmodalline"></hr>
            <div className="checkhintText">{contents}</div>
            <button className="checkModalBtn" onClick={closeCheckModal}>확인</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckModal;
