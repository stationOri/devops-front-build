import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import markerIcon from "../assets/images/restaurant.png";

const RestaurantLocationMap = ({ address }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([37.339832, 127.108985], 17);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "stationOri : Waitmate",
      maxZoom: 18,
    }).addTo(map);

    const customIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [42, 42],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const addMarker = async () => {
      const apiUrl = "/api/req/address";
      const params = {
        service: "address",
        request: "getcoord",
        version: "2.0",
        crs: "epsg:4326",
        address: address,
        type: "ROAD",
        key: process.env.REACT_APP_VWORLD_API_KEY,
      };

      try {
        const response = await axios.get(apiUrl, { params: params });
        const { result } = response.data.response;

        const { x, y } = result.point;
        const latlng = L.latLng(parseFloat(y), parseFloat(x));

        L.marker(latlng, { icon: customIcon }).addTo(map).bindPopup(address);
        map.setView(latlng, 19);
      } catch (error) {
        console.error("API 호출 오류:", error);
      }
    };

    if (address) {
      addMarker();
    }

    return () => {
      map.remove();
    };
  }, [address]);

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

export default RestaurantLocationMap;
