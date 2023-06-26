import { useState } from "react";
import axios from "axios";
import Navi from "../Navi";
import "./Login.css";

const Login = ({ history }) => {

    const [userId, setUserId] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const handlerChangeUserId = e => setUserId(e.target.value);
    const handlerChangeUserPassword = e => setUserPassword(e.target.value);

    const handlerOnClick = e => {
        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/login`, { userId, userPassword })
            .then(response => {
                console.log(response);
                if (response.data) {
                    alert('정상적으로 로그인 되었습니다. 게시판으로 이동합니다.')
                    sessionStorage.setItem("token", response.data);
                    history.push('/main');
                } else {
                    alert('ID, PW가 일치하지 않습니다. 확인 후 다시 시도해주세요.')
                    sessionStorage.clear();
                }
            })
            .catch(error => {
                console.log(error);
                alert('ID, PW가 일치하지 않습니다. 확인 후 다시 시도해주세요.')
                sessionStorage.clear();
            });
    };

    return (
        <>
            <div>
                <Navi />
            </div>
            <div className="login_container">
                <div className="title">
                    <h1>LOGIN</h1>
                </div>
                <div className="loginbox">
                    <div className="form-group">
                        <input type="text" id="ID" placeholder="ID" value={userId} onChange={handlerChangeUserId} />
                    </div>
                    <div className="mt-2 form-group">
                        <input type="password" id="PW" placeholder="PASSWORD" value={userPassword} onChange={handlerChangeUserPassword} />
                    </div>
                    <div>
                        <button className="login_button" onClick={handlerOnClick}>login</button>
                    </div>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default Login;