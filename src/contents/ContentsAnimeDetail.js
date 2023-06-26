import React, { Fragment, useState, useEffect } from 'react';
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import { useHistory } from 'react-router-dom';
import './ContentsAnimeDetail.css';
import Navi from '../Navi';

const ContentsAnimeDetail = () => {

  const [datas, setDatas] = useState([]);

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

  const { animeIdx } = useParams();
  const boxOfficeResult = datas.filter(item => item.animeIdx === animeIdx);

  const history = useHistory();
  const handlerClickList = () => {
    console.log(history);
    history.push('/anime');
  };

  // const boxOfficeResult = datas.filter(item => item.rank === "1");
  const animeNm = boxOfficeResult.length > 0 ? boxOfficeResult[0].animeNm : "";
  const animeOri = boxOfficeResult.length > 0 ? boxOfficeResult[0].animeOri : "";
  const poster = boxOfficeResult.length > 0 ? boxOfficeResult[0].poster : "";
  const category = boxOfficeResult.length > 0 ? boxOfficeResult[0].category : "";
  const story = boxOfficeResult.length > 0 ? boxOfficeResult[0].story : "";
  const original = boxOfficeResult.length > 0 ? boxOfficeResult[0].original : "";
  const director = boxOfficeResult.length > 0 ? boxOfficeResult[0].director : "";
  const producer = boxOfficeResult.length > 0 ? boxOfficeResult[0].producer : "";
  const episode = boxOfficeResult.length > 0 ? boxOfficeResult[0].episode : "";
  const grade = boxOfficeResult.length > 0 ? boxOfficeResult[0].grade : "";
  const gradeImg = boxOfficeResult.length > 0 ? boxOfficeResult[0].gradeImg : "";
  const startDt = boxOfficeResult.length > 0 ? boxOfficeResult[0].startDt : "";
  const endDt = boxOfficeResult.length > 0 ? boxOfficeResult[0].endDt : "";
  const streaming = boxOfficeResult.length > 0 ? boxOfficeResult[0].streaming : [];

  return (
    <>
      <div className="navi">
        <Navi />
      </div>
  

      <div className="contents_card" style={{ fontFamily: "GmarketSansMedium" }}>
        <div class="container" id="one">
          <div class="first">
            <p class="coldbrew">{animeNm}</p>
            <img src={poster} alt="포스터" />
          </div>

          {/* <!--중반부 를 두개의 div태그로 나누어 오른쪾 절반의 구역으로 나눠줌--> */}
          <div class="second">
            {/* <br> */}
            <p class="gray">{category}</p>
            {/* </br> */}
            <div id="fifth">
              <div class="emojiright">
                <p class="coffeename">{animeNm}</p>
                <p class="coffeename2">{animeOri}</p>
              </div>
              <div id="heart2">
                <a href="#"><i class="far fa-heart" id="heart3"></i></a>
              </div>
            </div>

            <p class="seconddetail">{story}</p>

            <div class="productdetail">
              <span>원작가</span>
              <span>{original}</span>
            </div>

            <div class="productdetail">
              <span>첫 방영일</span>
              <span>{startDt}</span>
            </div>
            <div class="productdetail">
              <span>감독</span>
              <span>{director}</span>
            </div>
            <div class="productdetail">
              <span>제작</span>
              <span>{producer}</span>
            </div>
            <div
              class="productdetail">
              <span>{grade}</span>
              <span><img src={gradeImg} width="25" height="25" alt="등급" /></span>
            </div>
            <div class="productdetail">
              <span>서비스</span>
              {streaming.map((image, index) => (
                <div className="runType_img" key={index}>
                  <img src={image} width="10" height="25"></img>
                </div>
              ))}
            </div>
            <div class="productdetail">
              <span>총 화수</span>
              <span>{episode}</span>
            </div>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#FF6347'
                },
              }}>
              <Button type="primary" className="contents_toList"
                onClick={handlerClickList}>목록으로</Button>
            </ConfigProvider>
          </div>
        </div>
      </div>
      <div className="footer">
        <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
      </div>
    </>
  );

}

export default ContentsAnimeDetail;