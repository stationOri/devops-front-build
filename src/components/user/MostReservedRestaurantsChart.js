import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import "../../css/components/user/MostReservedRestaurantsChart.css";

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const MostReservedRestaurantsChart = ({ userId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMostReservedRestaurants = async () => {
      try {
        const response = await axios.get(`http://https://waitmate.shop/api:8080/restaurants/most/${userId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching most reserved restaurants:", error);
      }
    };

    fetchMostReservedRestaurants();
  }, [userId]);

  const chartData = {
    labels: data.map(restaurant => restaurant.restName),
    datasets: [
      {
        label: '예약 수',
        data: data.map(restaurant => restaurant.revCount),
        backgroundColor: [
          '#FABE28',
          '#FC7900',
          '#B3CC57',
          '#EF746F'
        ],
        hoverBackgroundColor: [
          '#FABE28',
          '#FC7900',
          '#B3CC57',
          '#EF746F'
        ]
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: '#fff',
        anchor: 'center',
        align: 'center',
        offset: -10,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 25,
        backgroundColor: (context) => context.dataset.backgroundColor,
        font: {
          weight: 'bold',
          size: '10',
        },
        formatter: (value, context) => {
          return context.chart.data.labels[context.dataIndex];
        },
        clip: false 
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }
  };

  return (
    <div className="my-most-graph-container">
      <div className='my-most-graph-title' >최근 2년간 많이 방문한 식당</div>
      {data.length > 0 ? (
        <Pie data={chartData} options={options} />
      ) : (
        <p>데이터를 불러오는 중...</p>
      )}
    </div>
  );
};

export default MostReservedRestaurantsChart;