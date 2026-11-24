import React from 'react';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import '../styles/Rating.css';

export default function Rating({ rating = 0, numRev = 0 }) {
    const halfStars = Math.round(rating * 2);

    return (
        <div className="rating-container">
            {numRev > 0 ? (
                <>
                    <div className="rating" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map(star => {
                            const Icon = halfStars >= star * 2 ? StarIcon
                                : halfStars === star * 2 - 1 ? StarHalfIcon : StarBorderIcon;
                            return <Icon key={star} />;
                        })}
                    </div>
                    <span>{rating.toFixed(1)} out of 5 · {numRev} {numRev === 1 ? 'rating' : 'ratings'}</span>
                </>
            ) : <span>No ratings yet</span>}
        </div>
    );
}
