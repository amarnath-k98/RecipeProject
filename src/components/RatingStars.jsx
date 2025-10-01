import React from 'react'

const RatingStars = ({ rating, onRate }) => {
    console.log("RatingStars props:", { rating, onRate });
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className={`text-xl sm:text-2xl ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } hover:text-yellow-500 transition duration-200 ease-in-out`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default RatingStars;
