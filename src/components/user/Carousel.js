import React, { useState } from "react";
import "../../css/components/user/Carousel.css";
import StarRatingsCarousel from "./StarRatingCarousel";

function Carousel({ bannerFoods }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePrevClick = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? bannerFoods.length - 1 : prevSlide - 1
    );
  };

  const handleNextClick = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === bannerFoods.length - 1 ? 0 : prevSlide + 1
    );
  };

  return (
    <div className="carousel">
      <div className="carouselTrack">
        {bannerFoods.map((rest, index) => (
          <div
            key={rest.id}
            className={`carouselSlide ${index === currentSlide ? "active" : ""}`}
            style={{
              transform: `translateX(${100 * (index - currentSlide)}%) scale(${
                index === currentSlide ? 1 : 0.8
              })`,
              zIndex: index === currentSlide ? 2 : 1,
              opacity: index === currentSlide ? 1 : 0.5,
            }}
          >
            <div className="carouselWrapper">
              <div
                className="backgroundImage"
                style={{ backgroundImage: `url(${rest.restPhoto})` }}
              >
                <div className="carouselcontents">
                  <div className="carouselname">{rest.restName}</div>
                  <div className="carouseladdress">{rest.restAddress}</div>
                  <div className="carouselrating">
                    <StarRatingsCarousel rating={rest.restGrade} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="buttonWrapper">
        <button className="carouselButton prevButton" onClick={handlePrevClick}>
          ◀
        </button>
        <div className="carouselIndicators">
          {bannerFoods.map((_, index) => (
            <span
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
        <button className="carouselButton nextButton" onClick={handleNextClick}>
          ▶
        </button>
      </div>
    </div>
  );
}

export default Carousel;
