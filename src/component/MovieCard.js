import React from 'react';
import './MovieCard.css';
import styled from 'styled-components';


const MovieCard = ({ item }) => {
  const { movieNm, link, image, openDt, audiAcc } = item;
  return (
    <div className="movie-card-container">
      <CardImg image={image} />
      <div className="movie-text">
        <h2>{movieNm}</h2>
        <div>{`${openDt}개봉일`}</div>
        <div className="movie-summary-row">
          <h5>평점</h5>
        </div>
        <div className="movie-likes">{`${audiAcc}`}</div>
      </div>
    </div>
  );
};

const CardImg = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${(props) => props.image});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 111 !important;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  -webkit-mask-image: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0, rgba(0, 0, 0, 1)),
    color-stop(0.35, rgba(0, 0, 0, 1)),
    color-stop(0.5, rgba(0, 0, 0, 1)),
    color-stop(0.65, rgba(0, 0, 0, 1)),
    color-stop(0.85, rgba(0, 0, 0, 0.6)),
    color-stop(1, rgba(0, 0, 0, 0))
  );
  position: relative;
`;

export default MovieCard;
