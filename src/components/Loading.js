import React from "react";
import "../css/components/Loading.css";

function Loading() {
  return (
      <div className="loading-container">
        <div className="loading"></div>
        <div id="loading-text">loading</div>
      </div>
  );
}

export default Loading;
