import React from "react";
import Cal from "../assets/images/modal/cal.png";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "../css/components/Modal/SendTalkModal.css";

function DateBox({ selectedDate, handleDateChange }) {
  return (
    <div className="dateborderWrapper">
      <img src={Cal} alt="" className="calphoto" />
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        className="pickerdate insmallrev"
        placeholderText="DATE"
        dateFormat="yyyy-MM-dd"
      />
    </div>
  );
}

export default DateBox;
