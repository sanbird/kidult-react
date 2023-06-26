import Navi from "./Navi";
import "./Main.css";
import { Link } from "react-router-dom";
import React, { Fragment, useState, useEffect } from 'react';
import axios from "axios";
import { Col, Row, Card } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import mainBanner from "./img/mainBanner.jpg";

SwiperCore.use([Navigation, Pagination, Autoplay])


const { Meta } = Card;

const Main = ({ history }) => {


    const [datas, setDatas] = useState([]);
    const [movDatas, setMovDatas] =  useState([]);


    useEffect(() => {
        console.log(datas);
        axios.get('/item/anitem.json')
            .then(response => {
                console.log(response);
                setDatas(response.data.boxOfficeResult.weeklyBoxOfficeList);
                console.log(response.data.boxOfficeResult.weeklyBoxOfficeList);
            })
            .catch(error => console.log(error));
        axios.get('/item/item.json')
            .then(response => {
                console.log(response);
                setMovDatas(response.data.boxOfficeResult.weeklyBoxOfficeList);
                console.log(response.data.boxOfficeResult.weeklyBoxOfficeList);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <>
            <div >
                <div className="navi">
                    <Navi />
                </div>
                <div className="main_banner">
                    <img className="main_banner" src={mainBanner} />
                </div>
                <div className="main_contents">

                    <div className="main_card" >
                        <Swiper
                            className="banner"
                            spaceBetween={50}
                            slidesPerView={4}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            style={{ width: "1600px" }}
                        >
                            {datas &&
                                datas.map((weeklyBoxOfficeList) => (
                                    <SwiperSlide key={weeklyBoxOfficeList.animeIdx} >
                                        <Row gutter={[8, 64]} className="contents_card">
                                            <Col span={32}>
                                                <Link to={`/animeDetail/${weeklyBoxOfficeList.animeIdx}`}>
                                                    <Card
                                                        hoverable
                                                        style={{ width: 240, backgroundColor: "#e5e5e5" }}
                                                        cover={<img src={weeklyBoxOfficeList.poster} alt="Poster" height="346px"></img>}
                                                    >
                                                        <Meta title={weeklyBoxOfficeList.animeNm} style={{ fontFamily: "GmarketSansMedium" }} />
                                                    </Card>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>
                    <div className="main_card" >
                        <Swiper
                            className="banner"
                            spaceBetween={50}
                            slidesPerView={4}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 5000 }}
                            style={{ width: "1600px" }}
                        >
                            {movDatas &&
                                movDatas.map((weeklyBoxOfficeList) => (
                                    <SwiperSlide key={weeklyBoxOfficeList.rank} >
                                        <Row gutter={[8, 64]} className="contents_card">
                                            <Col span={32}>
                                                <Link to={`/movieDetail/${weeklyBoxOfficeList.rank}`}>
                                                    <Card
                                                        hoverable
                                                        style={{ width: 240, backgroundColor: "#e5e5e5" }}
                                                        cover={<img src={weeklyBoxOfficeList.poster} alt="Poster" height="346px"></img>}
                                                    >
                                                        <Meta title={weeklyBoxOfficeList.movieNm} style={{ fontFamily: "GmarketSansMedium" }} />
                                                    </Card>
                                                </Link>
                                            </Col>
                                        </Row>
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>
                </div>

                <div className="footer">
                    <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
                </div>
            </div>
        </>
    );
};

export default Main;