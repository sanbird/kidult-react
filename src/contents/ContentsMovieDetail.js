import React, { Fragment, useState, useEffect } from 'react';
import axios from "axios";
import { Link, useParams } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import { useHistory } from 'react-router-dom';
import './ContentsMovieDetail.css';
import Navi from '../Navi';

const ContentsMovieDetail = () => {

  const [datas, setDatas] = useState([]);

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

  const { rank } = useParams();
  const boxOfficeResult = datas.filter(item => item.rank === rank);

  const history = useHistory();
  const handlerClickList = () => {
    console.log(history);
    history.push('/movie');
  };

  // const boxOfficeResult = datas.filter(item => item.rank === "1");
  const movieNm = boxOfficeResult.length > 0 ? boxOfficeResult[0].movieNm : "";
  const movieOri = boxOfficeResult.length > 0 ? boxOfficeResult[0].movieOri : "";
  const poster = boxOfficeResult.length > 0 ? boxOfficeResult[0].poster : "";
  const category = boxOfficeResult.length > 0 ? boxOfficeResult[0].category : "";
  const story = boxOfficeResult.length > 0 ? boxOfficeResult[0].story : "";
  const director = boxOfficeResult.length > 0 ? boxOfficeResult[0].director : "";
  const actor = boxOfficeResult.length > 0 ? boxOfficeResult[0].actor : "";
  const grade = boxOfficeResult.length > 0 ? boxOfficeResult[0].grade : "";
  const gradeImg = boxOfficeResult.length > 0 ? boxOfficeResult[0].gradeImg : "";
  const openDate = boxOfficeResult.length > 0 ? boxOfficeResult[0].openDate : "";
  const runTime = boxOfficeResult.length > 0 ? boxOfficeResult[0].runTime : "";
  const proCost = boxOfficeResult.length > 0 ? boxOfficeResult[0].proCost : "";
  const audiAcc = boxOfficeResult.length > 0 ? boxOfficeResult[0].audiAcc : "";
  const runType = boxOfficeResult.length > 0 ? boxOfficeResult[0].runType : [];


  return (
    <>
      <div className="navi">
        <Navi />
      </div>
      
      <div className="contents_card" style={{fontFamily: "GmarketSansMedium"}} >
        <div class="container" id="one">
          <div class="first">
            <p class="coldbrew">{movieNm}</p>
            <img src={poster} alt="포스터" />
          </div>

          {/* <!--중반부 를 두개의 div태그로 나누어 오른쪾 절반의 구역으로 나눠줌--> */}
          <div class="second" >
            {/* <br> */}
            <p class="gray">{category}</p>
            {/* </br> */}
            <div id="fifth">
              <div class="emojiright">
                <p class="coffeename">{movieNm}</p>
                <p class="coffeename2">{movieOri}</p>
              </div>
              <div id="heart2">
                <a href="#"><i class="far fa-heart" id="heart3"></i></a>
              </div>
            </div>

            <p class="seconddetail">{story}</p>

            <div class="productdetail">
              <span>영화감독</span>
              <span>{director}</span>
            </div>

            {/* <!--영양정보를 담아주는 div 태그--> */}

            <div class="productdetail2">
              {/* <!--영양 정보를 좌우로 반반 나눠주었으며, 왼쪽에 해당하는 div 태그--> */}
              <div class="boxone">
                <ul>
                  <ul>
                    <li>
                      <span class="l">개봉일 : </span>
                      <span className="r">{openDate}</span>
                    </li>
                    <li>
                      <span class="l">상영시간 : </span>
                      <span className="r">{runTime}</span>
                    </li>
                    <li>
                      <span class="l">누적관객 : </span>
                      <span className="r">{audiAcc}</span>
                    </li>

                  </ul>
                </ul>
              </div>

              {/* <!--영양 정보를 좌우로 반반 나눠주었으며, 오른쪽에 해당하는 div 태그--> */}
              <div class="boxtwo">
                <ul>
                  <ul>
                    <li>
                      <span class="l">제작비 : </span>
                      <span class="r">{proCost}</span>
                    </li>
                    <li className="grade">
                      <span className="gradeImg">{grade}</span>
                      <span><img src={gradeImg} width="25" height="25" /></span>
                    </li>
                    <li>상영타입</li>
                    <li className="runType_list">
                      {runType.map((image, index) => (
                        <div className="runType_img" key={index}>
                          <img src={image} width="10" height="25"></img>
                        </div>
                      ))}
                    </li>

                  </ul>
                </ul>
              </div>

            </div>

            <div class="allegy">주연배우 : {actor}</div>
           

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

export default ContentsMovieDetail;