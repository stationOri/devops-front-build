import React, { useState, useEffect } from "react";
import Loading from "../../components/Loading";
import Carousel from "../../components/user/Carousel";
import ArrayRestaurantsMap from "../../components/ArrayRestaurantsMap";
import StarRatingsCarousel from "../../components/user/StarRatingCarousel";
import "../../css/pages/Main.css";
import ReviewCardMain from "../../components/ReviewCardMain";
import useGeolocation from "./useGeolocation";

const Main = ({ userId, onCardClick }) => {
  const [loading, setLoading] = useState(true);
  const [bannerFoods, setBannerFoods] = useState([]);
  const [trendingFoods, setTrendingFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);

  const { loaded, coordinates, error } = useGeolocation();

  useEffect(() => {
    if (loaded && coordinates) {
      console.log("Current Coordinates:", coordinates);
      setUserLat(coordinates.lat);
      setUserLng(coordinates.lng);
    } else if (error) {
      console.error("Geolocation Error:", error.message);
    }
  }, [loaded, coordinates, error]);

  const getBannerFood = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/api/restaurants/recommend`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const json = await response.json();
      setBannerFoods(json || []);
    } catch (error) {
      console.error("Error fetching banner foods:", error);
    }
  };

  const getTrendingFood = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/api/restaurants/hot`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const json = await response.json();
      setTrendingFoods(json || []);
    } catch (error) {
      console.error("Error fetching trending foods:", error);
    }
  };

  const getRestaurantsData = async () => {
    if (userLat && userLng) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URI}/api/restaurants/near/lat/${userLat}/lng/${userLng}`);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const json = await response.json();
        setRestaurants(json || []);
      } catch (error) {
        console.error("Error fetching restaurants data:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getBannerFood(),
        getTrendingFood(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userLat && userLng) {
      getRestaurantsData();
    }
  }, [userLat, userLng]);

  const handleCardClick = (restId) => {
    onCardClick(restId);
    console.log(restId);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="carouselContainer">
        <Carousel bannerFoods={bannerFoods} />
      </div>
      <div className="mainMapWrapper">
        {selectedRestaurant && (
          <div className="mainRestDetailWrapper">
            <div className="divforalignment">
              <div className="topbox">
                <img
                  className="mainRestExPhoto"
                  src={selectedRestaurant.restPhoto}
                  alt=""
                />
                <div className="reviewleft">
                  <div className="maincardrestname">
                    {selectedRestaurant.restName}
                  </div>
                  <div className="maincardKeywordWrapper">
                    {selectedRestaurant.keyword1 && (
                      <div className="mainkeywordbox">
                        #{selectedRestaurant.keyword1}
                      </div>
                    )}
                    {selectedRestaurant.keyword2 && (
                      <div className="mainkeywordbox">
                        #{selectedRestaurant.keyword2}
                      </div>
                    )}
                    {selectedRestaurant.keyword3 && (
                      <div className="mainkeywordbox">
                        #{selectedRestaurant.keyword3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mainreviewCardWrapper">
                {selectedRestaurant.reviews.map((review, index) => (
                  <ReviewCardMain key={index} review={review} />
                ))}
              </div>
            </div>
          </div>
        )}
        <ArrayRestaurantsMap
          restaurants={restaurants}
          onMarkerClick={(restaurant) => setSelectedRestaurant(restaurant)}
          lat={userLat}
          lng={userLng}
        />
      </div>
      <div className="hotTrendingRestWrapper">
        <div className="hotTrendingHeader">🔥CD 테스트입니다🔥</div>
        {trendingFoods.map((rest, index) => (
          <div key={index} className="rankingWrapper">
            <div className="rankingLeft">
              <div
                className="RankingIndex"
                style={{
                  color: index === 0 ? "#FF8A00" : "black",
                  fontWeight: index === 0 ? "bold" : "",
                }}
              >
                {index + 1}
              </div>
              <img className="rankPhoto" src={rest.restPhoto} alt="" onClick={() => handleCardClick(rest.restId)}/>
              <div className="MainRestNameWrapper">
                <div className="MainRestName">{rest.restName}</div>
                <div className="MainKeywordWrapperMini">
                  {rest.keyword1 && (
                    <div className="innerKeywords">#{rest.keyword1}</div>
                  )}
                  {rest.keyword2 && (
                    <div className="innerKeywords">#{rest.keyword2}</div>
                  )}
                  {rest.keyword3 && (
                    <div className="innerKeywords">#{rest.keyword3}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="rankingRight">
              <div className="starRatingText">{rest.restGrade}/5</div>
              <StarRatingsCarousel rating={rest.restGrade} />
            </div>
          </div>
        ))}
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default Main;
