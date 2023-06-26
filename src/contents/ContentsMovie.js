import React, { Fragment, useState, useEffect } from 'react';
// import item from "./item.json";
import { Link, } from 'react-router-dom';
import { Col, Row, Input, Card } from 'antd';
import axios from "axios";
import './ContentsMovie.css';
import Navi from '../Navi';
import movieBanner from "../img/movieBanner.jpg";


const { Search } = Input;
const { Meta } = Card;
const ContentsMovie = () => {

  const [datas, setDatas] = useState([]);


  //영화진흥위원회 api
  useEffect(() => {

    console.log(datas);
    axios.get('/item/item.json')
      .then(response => {
        console.log(response);
        setDatas(response.data.boxOfficeResult.weeklyBoxOfficeList);
        console.log(response.data.boxOfficeResult.weeklyBoxOfficeList);
      })
      .catch(error => console.log(error));
  }, []);



  return (
    <>
      <div className="navi">
        <Navi />
      </div>
      
      <div>
        <img className="movie_banner" src={movieBanner} />
      </div>
      <Fragment>
        <div className='movie_container'>
          <Row gutter={[8, 64]} className="contents_card">
            {datas && datas.map(weeklyBoxOfficeList => (
              <Col xs={24} sm={12} md={6}>
                <Link to={`/movieDetail/${weeklyBoxOfficeList.rank}`}>
                  <Card
                    hoverable
                    style={{ width: 240, backgroundColor: "#e5e5e5" }}
                    cover={<img src={weeklyBoxOfficeList.poster} alt="Poster" height="346px"></img>}>
                    <Meta title={weeklyBoxOfficeList.movieNm} description={`개봉일 ${weeklyBoxOfficeList.openDate}`} style={{fontFamily: "GmarketSansMedium"}}/>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </Fragment>
      <div className="footer">
        <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
      </div>
    </>
  );
};

export default ContentsMovie;