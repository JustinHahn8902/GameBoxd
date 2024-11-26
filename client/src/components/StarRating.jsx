import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";

function StarRating({ handleRating, size, rating }) {
    const [hoverRating, setHoverRating] = useState(null); // Hovered rating

    return (
        <div>
            {[...Array(10)].map((star, index) => {
                const currentRating = index + 1;
                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rate"
                            value={currentRating}
                            onClick={() => handleRating(currentRating)}
                            style={{ display: "none" }} // Hide the input
                        />
                        <FaStar
                            size={size}
                            color={
                                hoverRating
                                    ? currentRating <= hoverRating
                                        ? "#7CB9E8" // Blue for hover
                                        : "gray"
                                    : currentRating <= rating
                                    ? "orange" // Yellow when not hovering
                                    : "gray"
                            }
                            onMouseEnter={() => setHoverRating(currentRating)} // Set hover state
                            onMouseLeave={() => setHoverRating(null)} // Reset hover state
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default StarRating;
