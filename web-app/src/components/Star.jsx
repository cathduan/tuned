// Renders a 1–5 clickable star rating component. Clicking a star updates the current rating via setRating prop.

import React from "react";

function StarRating({ rating, setRating }) {
  return (
    <div>
      {/* Render 5 stars */}
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          className="stars"
          data-testid={`star-${star}`} // useful for testing
          style={{
            cursor: "pointer",
            color: rating >= star ? "gold" : "gray", // highlight filled stars
            fontSize: "30px",
          }}
          onClick={() => setRating(star)} // update rating on click
          key={star}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;