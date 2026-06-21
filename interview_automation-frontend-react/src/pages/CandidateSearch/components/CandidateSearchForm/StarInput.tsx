import { useState } from 'react';

type StarInputProps = {
  value: string,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

function StarInput({ value, handleChange }: StarInputProps): JSX.Element {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [totalStars] = useState(5);

  return <div style={{ display: 'flex', }}>
    {[...Array(totalStars)].map((_, index) => {
      const currentRating = index + 1;

      return (
        <label key={`${`${index  }star`}`}>
          <input
            type="radio"
            name={value}
            style={{ display: 'none' }}
            value={(index + 1) * 20}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              handleChange(e);
              setRating(currentRating); }
            }
          />
          <span
            className="star"
            style={{
              color:
            currentRating <= (hover || rating) ? '#ffc107' : '#e4e5e9'
            }}
            onMouseEnter={() => setHover(currentRating)}
            onMouseLeave={() => setHover(0)}
          >
        &#9733;
          </span>
        </label>
      );
    })}
  </div>;
}

export default StarInput;
