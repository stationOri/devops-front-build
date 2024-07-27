import React from 'react';
import '../css/components/StarRatings.css';

function StarRatings({ rating }) {
  const ratingToPercent = (rating / 5) * 100;

  return (
    <div className='star-ratings-container'>
      <div className="star-ratings">
        <div className="star-ratings-fill space-x-2 text-lg" style={{ width: `${ratingToPercent}%` }}>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <div className="star-ratings-base space-x-2 text-lg">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
      </div>
      <div>
        <span className="text-sm">({rating})</span>
      </div>
    </div>
  );
}

export default StarRatings;