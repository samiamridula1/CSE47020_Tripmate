import React from "react";
import "./TripFlipCard.css";

const TripFlipCard = ({ destination, reason, image }) => {
  return (
    <div className="card">
      <div className="card-inner">
        <div className="card-front">
          <img src={image} alt={destination} className="card-image" />
          <h3 className="card-title">{destination}</h3>
        </div>

        <div className="card-back">
          <p className="card-reason">{reason}</p>
          <button className="wishlist-btn">Add to Wishlist</button>
        </div>
      </div>
    </div>
  );
};

export default TripFlipCard;