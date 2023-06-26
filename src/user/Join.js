import { useState } from "react";
import axios from "axios";
import Navi from "../Navi";
import "./Join.css";

const Join = ({ history }) => {

    const [userId, setUserId] = useState('');
    const [userPassword, setUserpassword] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [cash, setCash] = useState(1000000);    

    const handlerChangeUserId = e => setUserId(e.target.value);
    const handlerChangeUserPassword = e => setUserpassword(e.target.value);
    const handlerChangeUserName = e => setUserName(e.target.value);
    const handlerChangeUserEmail = e => setUserEmail(e.target.value);

    const handlerOnClick = e => {
        e.preventDefault();
        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/regist`, { userId, userPassword, userEmail, userName, cash})
            .then(response => {
                console.log(response);
                if (response.data) {
                    alert('정상적으로 가입 되었습니다. 게시판으로 이동합니다.')
                    history.push('/main');
                }
            })
            .catch(error => {
                console.log(error);
                alert('확인 후 다시 시도해주세요.')
            });
    };

    return (
        <>
            <div className="navi">
                <Navi />
            </div>

            <div className="join_container">
                <div className="title"><h1>SIGN UP</h1></div>
                <div className="joinbox">
                    <div className="content">
                        <label for="id"><span>* </span>아이디</label><input type="text" placeholder="아이디를 입력해주세요." value={userId} onChange={handlerChangeUserId} />
                    </div>
                    <div className="content">
                        <label for="pw"><span>* </span>비밀번호</label><input type="text" placeholder="비밀번호를 입력해주세요." value={userPassword} onChange={handlerChangeUserPassword} />
                    </div>
                    <div className="content">
                        <label for="name"><span>* </span>이름</label><input type="text" placeholder="이름을 입력해주세요." value={userName} onChange={handlerChangeUserName} />
                    </div>
                    <div className="content">
                        <label for="email"><span>* </span>이메일</label><input type="text" placeholder="이메일을 입력해주세요." value={userEmail} onChange={handlerChangeUserEmail} />
                    </div>
                    <button className="join_button" onClick={handlerOnClick}>Join</button>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default Join;