import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navi.css";
import jwt_decode from "jwt-decode";
import axios from "axios";
import logo from "./img/mainlogo.png";

const GuestNavi = () => {
    return (
        <>
            <div className="navi_bar">
                <div className="navi_login">
                    <Link to="/login" style={{ textDecoration: "none", color: "white" }}>로그인</Link>
                </div>
                <div className="navi_join">
                    <Link to="/join" style={{ textDecoration: "none", color: "white" }}>회원가입</Link>
                </div>
                <div className="navi_main">
                    <Link to="/main" style={{ textDecoration: "none", color: "white" }}><img src={logo} height={30}/></Link>
                </div>
                <div className="navi_movie">
                    <Link to="/movie" style={{ textDecoration: "none", color: "white" }}>Movie</Link>
                </div>        
                <div className="navi_anime">
                    <Link to="/anime" style={{ textDecoration: "none", color: "white" }}>Animation</Link>
                </div>        
                <div className="navi_shop">
                    <Link to="/shopList" style={{ textDecoration: "none", color: "white" }}>Shop</Link>
                </div>
                <div className="navi_direct">
                    <Link to="/directList" style={{ textDecoration: "none", color: "white" }}>Direct</Link>
                </div>
                <div className="navi_community">
                    <Link to="/board" style={{ textDecoration: "none", color: "white" }}>Community</Link>
                </div>
                <div className="navi_notice">
                    <Link to="/notice" style={{ textDecoration: "none", color: "white" }}>Notice</Link>
                </div>
                
                
            </div>
        </>
    );
}

const UserNavi = ({ logout, userName }) => {
    return (
        <>
            <div className="navi_bar">
                <div className="navi_mypage">
                    <Link to="/myPage" style={{ textDecoration: "none", color: "white" }}>내 정보</Link>
                </div>
                <div className="navi_logout">
                    <Link to="/main" style={{ textDecoration: "none", color: "white" }} onClick={logout}>로그아웃</Link>
                </div>
                <div className="navi_name" style={{ textDecoration: "none", color: "white" }} >{userName} 님 환영합니다.</div>
                <div className="navi_main">
                    <Link to="/main" style={{ textDecoration: "none", color: "white" }}><img src={logo} height={30}/></Link>
                </div>
                <div className="navi_movie">
                    <Link to="/movie" style={{ textDecoration: "none", color: "white" }}>Movie</Link>
                </div>        
                <div className="navi_anime">
                    <Link to="/anime" style={{ textDecoration: "none", color: "white" }}>Animation</Link>
                </div>        
                <div className="navi_shop">
                    <Link to="/shopList" style={{ textDecoration: "none", color: "white" }}>Shop</Link>
                </div>
                <div className="navi_direct">
                    <Link to="/directList" style={{ textDecoration: "none", color: "white" }}>Direct</Link>
                </div>
                <div className="navi_community">
                    <Link to="/board" style={{ textDecoration: "none", color: "white" }}>Community</Link>
                </div>
                <div className="navi_notice">
                    <Link to="/notice" style={{ textDecoration: "none", color: "white" }}>Notice</Link>
                </div>
            </div>
        </>
    );
};

const Navi = () => {

    const [isLoggedIn, setIsLoggedIn] = useState('');
    const handlerLogOut = e => {
        sessionStorage.removeItem('token');
        alert('로그아웃 되었습니다.');
        window.location.replace('/main');
    }

    const [userName, setUserName] = useState('');

    useEffect(() => {

        // axios로 DB에서 정보 가져오게 수정하기
        const token = sessionStorage.getItem('token');

        if (token != null) {
            setIsLoggedIn(true);
            const decoded_token = jwt_decode(token);
            console.log(decoded_token);
            

            axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/myInfo/${decoded_token.userIdx}`,
                { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
                .then(response => {
                    console.log(response);
                    setUserName(response.data.userName);
                });
        } else {
            setIsLoggedIn(false);
        };
    }, []);




    return (
        <>
            <div className="navi_all">
                {isLoggedIn ? <UserNavi logout={handlerLogOut} userName={userName} /> : <GuestNavi />}
            </div>
        </>
    )
};

export default Navi;

