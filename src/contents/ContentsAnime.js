import React, { Fragment, useState, useEffect } from 'react';
import { Link, } from 'react-router-dom';
import { Col, Row, Input, Card } from 'antd';
import axios from "axios";
import './ContentsAnime.css';
import Navi from '../Navi';
import animeBanner from "../img/animeBanner.jpg";


const { Meta } = Card;
const ContentsAnime = () => {

  const [datas, setDatas] = useState([]);

  //라프텔 역대 인기애니메이션 json
  useEffect(() => {
    console.log(datas);
    axios.get('/item/anitem.json')
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
        <img className="anime_banner" src={animeBanner} />
      </div>
      <Fragment>
        <div className="movie_container">
          <Row gutter={[8, 64]} className="contents_card">
            {datas && datas.map(weeklyBoxOfficeList => (
              <Col xs={24} sm={12} md={6}>
                <Link to={`/animeDetail/${weeklyBoxOfficeList.animeIdx}`}>
                  <Card
                    hoverable
                    style={{ width: 240, backgroundColor: "#e5e5e5" }}
                    cover={<img src={weeklyBoxOfficeList.poster} alt="Poster" height="346px"></img>}>
                    <Meta title={weeklyBoxOfficeList.animeNm} description={`첫 방영일 : ${weeklyBoxOfficeList.startDt}`} style={{fontFamily: "GmarketSansMedium"}}/>
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

export default ContentsAnime;