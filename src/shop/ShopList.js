import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navi from "../Navi";
import "./Shop.css";
import shopBanner from "../img/shopBanner.jpg";

const ShopList = ({ history }) => {

    const [datas, setDatas] = useState([]);
   


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        // if (!token) {
        //     alert('로그인 후 사용할 수 있습니다.');
        //     history.push('/main');
        //     return;
        // }

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/shopList`)
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
        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/download/`)
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
           
            <div className="shop_banner">
                <img className="shop_banner" src={shopBanner} />
            </div>
            <div className="shop_list">
                <div className="shop_container">
                    {datas && datas.map((shop, index) => (
                        <div className="shop_box" key={index}>
                            <Link to={`/shopDetail/${shop.shopIdx}`}>
                                <img src={`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/download?shopImage=` + shop.shopImage} />
                            </Link>
                            <div className="shop_content">
                                <Link to={`/shopDetail/${shop.shopIdx}`}><p style={{ color: "black" }}>{shop.shopName}</p></Link>
                                <p>
                                    <span>
                                        {shop.shopPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<em>원</em>
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default ShopList;