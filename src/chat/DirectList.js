import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navi from "../Navi";
import "./Direct.css";
import directBanner from "../img/directBanner.jpg";
import registIcon from "../img/regist_icon.png";

const DirectList = ({ history }) => {

    const [datas, setDatas] = useState([]);
   


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        // if (!token) {
        //     alert('로그인 후 사용할 수 있습니다.');
        //     history.push('/main');
        //     return;
        // }

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/directList`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response)
                setDatas(response.data);
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });
    }, []);

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/download/`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response)
                setDatas(response.data);
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });
    }, []);

    return (
        <>
            <div className="navi">
                <Navi />
            </div>           
            <div>
                <img className="direct_banner" src={directBanner} />
            </div>
            <div className="direct_list">
                <div className="direct_container">
                    {datas && datas.map((direct, index) => (
                        <div className="direct_box" key={index}>
                            <Link to={`/directDetail/${direct.directIdx}`}>
                                <img src={`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/downloadDirect?directImage=` + direct.directImage} />
                            </Link>
                            <div className="direct_content">
                                <Link to={`/directDetail/${direct.directIdx}`}><p style={{ color: "black" }}>{direct.directName}</p></Link>
                                <p>
                                    <span>
                                        {direct.directPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<em>원</em>
                                    </span>
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
            <div className="regist_box">
                <Link to={`/directRegist`}><img src={registIcon} width={20}/><span>직거래 등록하기</span></Link>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default DirectList;