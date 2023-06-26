import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserList.css";
import "./Admin.css";
import Pagination from "./Pagination";
import AdminNavi from "./AdminNavi";

const UserList = ({ history }) => {

    const [datas, setDatas] = useState([]);
  


    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            alert('로그인 후 사용할 수 있습니다.');
            history.push('/main');
            return;
        }

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/userList`,
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
            <div className="admin_navi">
                <AdminNavi />
            </div>
            <div className="admin_sidebar">
                <Link to="/shopRegist"><p>상품 등록</p></Link>
                <Link to="/couponRegist"><p>쿠폰 등록</p></Link>
                <Link to="/userList" ><p>유저 목록</p></Link>
            </div>
            <div className="user_container">
                <div className="us_head">
                    <h2>사용자 목록</h2>
                </div>
                <table className="user_list">
                    <colgroup>
                        <col width="15%" />
                        <col width="*" />
                        <col width="*" />
                        <col width="15%" />
                        <col width="10%" />
                        <col width="15%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">사용자 번호</th>
                            <th scope="col">아이디</th>
                            <th scope="col">이름</th>
                            <th scope="col">이메일</th>
                            <th scope="col">캐시</th>
                            <th scope="col">마일리지</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.length === 0 && (
                            <tr>
                                <td colSpan="4">일치하는 데이터가 없습니다.</td>
                            </tr>
                        )}
                        {datas && datas.map((user,index) => (
                            <tr key={index}>
                                <td>{user.userIdx}</td>
                                <td>{user.userId}</td>
                                <td>{user.userName}</td>
                                <td>{user.userEmail}</td>
                                <td>{user.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"}</td>
                                {/* <td><input className="user_cash" type="text" id="cash" name="cash" value={user.cash} onChange={handlerSetCash} />원</td> */}
                                <td>{user.mileage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default UserList;