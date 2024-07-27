import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "../assets/images/marker.png";
import oriMarker from "../assets/images/orimarker.png"
import Loading from "./Loading";

const ArrayRestaurantsMap = ({ restaurants, onMarkerClick, lat, lng }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const userLocationMarkerRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current || !restaurants || restaurants.length === 0) return;

      if (!mapInstance.current) {
        const defaultLatLng = [lat, lng];
        const defaultZoom = 13;

        const map = L.map(mapRef.current).setView(defaultLatLng, defaultZoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "stationOri : Waitmate",
          maxZoom: 18,
        }).addTo(map);

        mapInstance.current = map;
      }

      const customIcon = L.icon({
        iconUrl: markerIcon,
        iconSize: [32, 42],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const userLocationIcon = L.icon({
        iconUrl: oriMarker,
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      // const getLatLngFromAddress = async (address) => {
      //   const apiUrl = "/api/req/address";
      //   const params = {
      //     service: "address",
      //     request: "getcoord",
      //     version: "2.0",
      //     crs: "epsg:4326",
      //     address: address,
      //     type: "ROAD",
      //     key: process.env.REACT_APP_VWORLD_API_KEY,
      //   };

      //   try {
      //     const response = await axios.get(apiUrl, { params: params });
      //     const { result } = response.data.response;

      //     if (result && result.point) {
      //       const { x, y } = result.point;
      //       return L.latLng(parseFloat(y), parseFloat(x));
      //     } else {
      //       console.error(`주소에서 좌표를 가져오는 중 오류: ${JSON.stringify(result)}`);
      //       return null;
      //     }
      //   } catch (error) {
      //     console.error(`API 호출 오류 (${address}):`, error);
      //     return null;
      //   }
      // };

      const addMarkers = () => {
        const markerPromises = restaurants.map((restaurant) => {
          const latlng = L.latLng(restaurant.lat, restaurant.lng);

          const marker = L.marker(latlng, { icon: customIcon })
            .addTo(mapInstance.current)
            .bindPopup(`
              <div>
                <img src="${restaurant.restPhoto}" alt="${restaurant.restName}" style="width:100px;height:80px;" />
                <div><strong>${restaurant.restName}</strong></div>
                <div>${restaurant.restAddress}</div>
                <div>${restaurant.keyword1} ${restaurant.keyword2} ${restaurant.keyword3}</div>
              </div>
            `);

          marker.on("click", () => {
            if (markerRef.current) {
              markerRef.current.closePopup();
            }
            marker.openPopup();

            mapRef.current.style.width = "50%";
            mapInstance.current.setView(marker.getLatLng());

            markerRef.current = marker;
            onMarkerClick(restaurant);
          });

          marker.on("popupclose", () => {
            mapRef.current.style.width = "100%";
            markerRef.current = null;

            onMarkerClick(null);
          });

          return marker;
        });

        Promise.all(markerPromises).then(() => {
          if (restaurants.length > 0) {
            const bounds = new L.LatLngBounds();
            restaurants.forEach((restaurant) => {
              bounds.extend(L.latLng(restaurant.lat, restaurant.lng));
            });
            mapInstance.current.fitBounds(bounds);
          }
        });
      };

      if (lat && lng) {
        if (userLocationMarkerRef.current) {
          userLocationMarkerRef.current.remove();
        }
        const userMarker = L.marker([lat, lng], { icon: userLocationIcon }).addTo(mapInstance.current);
        userMarker.bindPopup("현재 위치");
        userLocationMarkerRef.current = userMarker;
      }
    

      addMarkers();

      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    };

    initializeMap();
  }, [restaurants, onMarkerClick, lat, lng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginTop: "20px",
      }}
    ></div>
  );
};

export default ArrayRestaurantsMap;