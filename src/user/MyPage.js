import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import Navi from "../Navi";
import "./MyPage.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const MyPage = ({ match, history }) => {

    const [userIdx, setUserIdx] = useState('');
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [cash, setCash] = useState('');
    const [mileage, setMileage] = useState('');

    const handlerChangeUserName = e => setUserName(e.target.value);
    const handlerChangeUserEmail = e => setUserEmail(e.target.value);

    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        setUserId(decoded_token.sub);
        setUserIdx(decoded_token.userIdx);

        let userIdx = decoded_token.userIdx;

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/myInfo/${userIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                setUserName(response.data.userName);
                setUserEmail(response.data.userEmail);
                setCash(response.data.cash);
                setMileage(response.data.mileage);
            });
    }, []);

    const handlerClickUpdate = () => {
        axios.put(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/myInfo/${userIdx}`,
            { "userId": userId, "userEmail": userEmail, "userName": userName, "userPassword": userPassword },
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response)
                if (response.data === 1) {
                    alert('정상적으로 수정되었습니다.');
                    window.location.reload();
                } else {
                    alert('수정에 실패했습니다.');
                    return;
                }
            })
            .catch(error => {
                console.log(error)
                alert(`수정에 실패했습니다.`);
                return;
            });
    };

    console.log(mileage);

    return (
        <>
            <div className="navi">
                <Navi />
            </div>
            <div className="mp_sidebar">
                <Link to="/myPage"><p>내 정보</p></Link>
                <Link to="/order"><p>주문내역</p></Link>
                <Link to="/chatroom"><p>채팅방</p></Link>
                <Link to="/cart"><p>장바구니</p></Link>
            </div>
            <div className="mp_container">
                <div className="title">MyPage</div>
                <div className="mpbox">
                    <div className="content">
                        <label>아이디</label><input type="text" id="userId" name="userId" value={userId} readOnly={true} />
                    </div>
                    <div className="content">
                        <label>이름</label><input type="text" id="userName" name="userName" value={userName} onChange={handlerChangeUserName} />
                    </div>
                    <div className="content">
                        <label>이메일</label><input type="text" id="userEmail" name="userEmail" value={userEmail} onChange={handlerChangeUserEmail} />
                    </div>
                    <div className="content">
                        <label>캐시</label><input type="text" id="cash" name="cash" value={cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"} readOnly={true} />
                    </div>
                    <div className="content">
                        <label>마일리지</label><input type="text" id="mileage" name="mileage" value={mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"} readOnly={true} />
                    </div>
                    <button className="mp_button" onClick={handlerClickUpdate}>수정</button>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default MyPage;