/**
 * @file Star.js
 * @description Renders a 1–5 star rating component. 
 * @authors Charlie Ney, Cathy Duan
 * @date 6/9/25
 */

/**
 * @param {Object} props
 * @param {number} props.rating - Current star rating (1 to 5).
 * @param {Function} props.setRating - Callback function to update the rating.
 * @returns {JSX.Element}  star rating display.
 */
function StarRating({ rating, setRating }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          className="stars"
          data-testid={`star-${star}`}
          style={{
            cursor: "pointer",
            color: rating >= star ? "gold" : "gray",
            fontSize: "30px",
          }}
          onClick={() => setRating(star)}
          key={star}
        >
          {' '}★{' '}
        </span>
      ))}
    </div>
  );
}

export default StarRating;
