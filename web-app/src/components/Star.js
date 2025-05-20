import React from "react";

function StarRating({ rating, setRating }) {
    return (
      <div>
        {[1, 2, 3, 4, 5].map((star) => {
          return (  
            <span
              className='stars'
              style={{
                cursor: 'pointer',
                color: rating >= star ? 'gold' : 'gray',
                fontSize: `30px`,
              }}
              onClick={() => {
                setRating(star)
              }}
            >
              {' '}★{' '}
            </span>
          )
        })}
      </div>
    )
  }
  
  export default StarRating;