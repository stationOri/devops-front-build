import React, { useState } from "react";
import DaumPostcode from "react-daum-postcode";

function AddressSearch({ onCompletePost }) {
  const [modalState, setModalState] = useState(false);

  const handleCompletePost = (data) => {
    setModalState(false);
    if (onCompletePost) {
      onCompletePost(data);
    }
  };

  return (
    <div>
      <button className="addressSearchBtn" onClick={() => setModalState(true)}>
        주소 검색
      </button>
      {modalState && (
        <div style={{ position: "absolute", zIndex: 1000, border:"1px solid #dddddd" }}>
          <DaumPostcode
            onComplete={handleCompletePost}
          />
        </div>
      )}
    </div>
  );
}

export default AddressSearch;
