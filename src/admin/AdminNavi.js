import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";
import "./Admin.css";

const UserNavi = ({ logout, userName }) => {
    return (
        <>
            <div className="admin_navi_bar">
                <div className="admin_navi_mypage">
                    <Link to="/myPage" style={{ textDecoration: "none", color: "white" }}>내 정보</Link>
                </div>
                <div className="admin_navi_logout">
                    <Link to="/main" style={{ textDecoration: "none", color: "white" }} onClick={logout}>로그아웃</Link>
                </div>
                <div className="admin_navi_name" style={{ textDecoration: "none", color: "white" }} >{userName} 님 환영합니다.</div>
                <div className="admin_navi_main">
                    <Link to="/main" style={{ textDecoration: "none", color: "white" }}>메인</Link>
                </div>
                <div className="admin_navi_user">
                    <Link to="/admin" style={{ textDecoration: "none", color: "white" }}>관리자 페이지</Link>
                </div>               
            </div>
        </>
    );
};

const AdminNavi = () => {

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
            <div className="admin_navi">
                <div>
                    <UserNavi logout={handlerLogOut} userName={userName} />
                </div>      
            </div>
        </>
    )
};

export default AdminNavi;