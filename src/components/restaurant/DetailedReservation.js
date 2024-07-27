import React, { useState } from "react";
import Human from "../../assets/images/Restaurant/human.png";
import Table from "../../assets/images/Restaurant/table.png";
import RevAcceptModal from "../Modal/RevAcceptModal";
import RestCancelModal from "../Modal/RestCancelModal";
import RestStatusChangeModal from "../Modal/RestStatusChangeModal";
import RestStatusModal from "../Modal/RestStatusModal";

function DetailedReservation({ reservations, row, restId }) {
  const [restcancelshow, setRestCancelShow] = useState(false);
  const [revacceptshow, setRevAcceptShow] = useState(false);
  const [revdetailshow, setRevDetailShow] = useState(false);
  const [restchangeshow, setRestChangeShow] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const RevAcceptShow = (reservation) => {
    setSelectedReservation(reservation);
    setRevAcceptShow(true);
  };

  const RevAcceptClose = () => {
    setRevAcceptShow(false);
    setSelectedReservation(null);
  };

  const RevDetailShow = (reservation) => {
    setSelectedReservation(reservation);
    setRevDetailShow(true);
  };

  const RevDetailClose = () => {
    setRevDetailShow(false);
    setSelectedReservation(null);
  };

  const RestCancelShow = (reservation) => {
    setSelectedReservation(reservation);
    setRestCancelShow(true);
  };

  const RestCancelClose = () => {
    setSelectedReservation(null);
    setRestCancelShow(false);
  };

  const RestChangeShow = (reservation) => {
    setSelectedReservation(reservation);
    setRestChangeShow(true);
  };

  const RestChangeClose = () => {
    setSelectedReservation(null);
    setRestChangeShow(false);
  };

  const getButtonText = (status, reservation) => {
    switch (status) {
      case "RESERVATION_READY":
        return (
          <button
            onClick={() => RevAcceptShow(reservation)}
            className="btninRestRev"
          >
            승인
          </button>
        );
      case "RESERVATION_ACCEPTED":
        return (
          <button
            onClick={() => RevDetailShow(reservation)}
            className="btninRestRev"
          >
            확인
          </button>
        );
      case "RESERVATION_REJECTED":
        return <div>거절됨</div>;
      case "RESERVATION_CANCELED":
        return <div>취소됨</div>;
      case "VISITED":
        return <div>방문</div>;
      case "NOSHOW":
        return <div>노쇼</div>;
      default:
        return <div>오류</div>;
    }
  };

  // Function to format time
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  // Track the previous time
  let previousTime = null;

  return (
    <>
      {reservations.map((rev, index) => {
        const date = new Date(rev.resDate);
        const currentTime = formatTime(date);
        const isNewLine = previousTime !== currentTime;

        // Update previousTime after processing the reservation
        previousTime = currentTime;

        let rowClass = "";
        switch (row) {
          case 1:
            rowClass = "firstElement";
            break;
          case 2:
            rowClass = "secondElement";
            break;
          case 3:
            rowClass = "thirdElement";
            break;
          case 4:
            rowClass = "fourthElement";
            break;
          default:
            rowClass = "";
        }

        const timeDisplay = isNewLine ? (
          <>
            <div>
              {date.getHours() % 12 || 12}:{date.getMinutes().toString().padStart(2, "0")}
            </div>
            <div style={{ fontSize: "13px" }}>
              {date.getHours() >= 12 ? "PM" : "AM"}
            </div>
          </>
        ) : null;

        return (
          <div
            className={`reservationBox ${rowClass} ${
              isNewLine ? "newLine" : "notNewLine"
            } ${index === reservations.length - 1 ? "lastElement" : ""} ${
              index === 0 ? "firstrevbox" : ""
            }`}
            key={rev.resId}
          >
            <div className="timebox">{timeDisplay}</div>
            <div className="reservationDetail">
              <div className="reservationdetailed">
                <div>{rev.userName}</div>
                <div className="boxforicon">
                  <div className="innericonbox">
                    <img src={Human} alt="" className="iconforrev humanicon" />
                    <div className="cnfornumber">{rev.resNum}</div>
                  </div>
                  <div className="innericonbox">
                    <img src={Table} alt="" className="iconforrev" />
                    <div className="cnfornumber">1</div>
                  </div>
                </div>
              </div>
              <div className="reservationforbtn">
                {getButtonText(rev.status, rev)}
              </div>
            </div>
            {revacceptshow && selectedReservation && (
              <RevAcceptModal
                RevAcceptClose={RevAcceptClose}
                revacceptshow={revacceptshow}
                reservation={selectedReservation}
                RestCancelShow={RestCancelShow}
              />
            )}
            {restcancelshow && (
              <RestCancelModal
                RestCancelClose={RestCancelClose}
                restcancelshow={restcancelshow}
                reservation={selectedReservation}
              />
            )}
            {revdetailshow && selectedReservation && (
              <RestStatusChangeModal
                RevDetailClose={RevDetailClose}
                revdetailshow={revdetailshow}
                reservation={selectedReservation}
                RestCancelShow={RestCancelShow}
                RestChangeShow={RestChangeShow}
              />
            )}
            {restchangeshow && (
              <RestStatusModal
                RestChangeClose={RestChangeClose}
                restchangeshow={restchangeshow}
                reservation={selectedReservation}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

export default DetailedReservation;
