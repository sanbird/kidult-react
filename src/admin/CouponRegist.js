// 쿠폰 생성 및 유저 쿠폰 지급
import axios from "axios";
import { useEffect, useState } from "react";
import AdminNavi from "./AdminNavi";
import Pagination from "./Pagination";
import jwt_decode from "jwt-decode";
import "./Admin.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";


const CouponRegist = ({ history }) => {

    const [datas, setDatas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = (datas) => {
        let currentPosts = 0;
        currentPosts = datas.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    };


    const [users, setUsers] = useState([]);
    const [userIdx, setUserIdx] = useState('');
    const [couponIdx, setCouponIdx] = useState('');
    const [couponName, setCouponName] = useState('');
    const [couponValue, setCouponValue] = useState('');
    const [giveCoupon, setGiveCoupon] = useState('');


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token.userIdx);
        setUserIdx(decoded_token.userIdx);

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/coupon`)
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
        const token = sessionStorage.getItem('token');

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/userList`)
            .then(response => {
                console.log(response)
                setUsers(response.data);
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });
    }, []);

    const handlerCouponName = e => setCouponName(e.target.value);
    const handlerCouponValue = e => setCouponValue(e.target.value);
    const selectCoupon = e => {
        setCouponIdx(e.target.value);
        console.log(e.target.value);
    };
    const selectUser = e => setUserIdx(e.target.value);


    //쿠폰 등록
    const handlerRegistCoupon = e => {

        e.preventDefault();
        console.log(couponName);
        console.log(couponValue);

        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/coupon`, { couponName, couponValue },
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                alert('쿠폰이 등록되었습니다.');
                window.location.reload();
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')

                }
            });
    };

    //쿠폰 지급
    const handlerGiveCoupon = e => {

        e.preventDefault();
        console.log(couponIdx);
        console.log(userIdx);

        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/giveCoupon`, { couponIdx, userIdx })
            .then(response => {
                console.log(response);
                alert('쿠폰이 지급되었습니다.');
                window.location.reload();
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });
    };


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
            <div className="rc_container">
                <div className="rc_head">
                    <h2>쿠폰 등록 페이지</h2>
                </div>
                <table className="rc_list">
                    <colgroup>
                        <col width="15%" />
                        <col width="20%" />
                        <col width="20%" />
                    </colgroup>
                    <thead className="rc_thead">
                        <tr>
                            <th scope="col">쿠폰 번호</th>
                            <th scope="col">쿠폰 이름</th>
                            <th scope="col">할인 가격</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.length === 0 && (
                            <tr>
                                <td colSpan="3">일치하는 데이터가 없습니다.</td>
                            </tr>
                        )}
                        {currentPosts(datas) && currentPosts(datas).map(coupon => (
                            <tr key={coupon.cartIdx}>
                                <td>{coupon.couponIdx}</td>
                                <td>{coupon.couponName}</td>
                                <td>{coupon.couponValue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="rc_regist">
                    <div className="rc_regist_head">
                        <h2>새 쿠폰 등록하기</h2>
                    </div>
                    <table>
                        <tbody>
                            <tr className="rc_name">
                                <td>쿠폰 이름</td>
                                <td><input type="text" id="couponName" name="couponName" value={couponName} onChange={handlerCouponName}
                                    placeholder="  이름을 입력하세요." style={{ fontSize: "15px" }} /></td>
                            </tr>
                            <tr className="rc_value">
                                <td>할인 가격</td>
                                <td><input type="text" id="couponValue" name="couponValue" value={couponValue} onChange={handlerCouponValue}
                                    placeholder="  가격을 입력하세요." style={{ fontSize: "15px" }} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="rc_button">
                        <button type="submit" id="submit" onClick={handlerRegistCoupon}>등록</button>
                    </div>
                </div>
                <div className="rc_give">
                    <div className="rc_give_head">
                        <h2>쿠폰 지급하기</h2>
                    </div>
                    <table>
                        <tbody>
                            <tr className="rc_user">
                                <td>쿠폰 이름&nbsp;&nbsp;</td>
                                <td>
                                    <select id="couponIdx" name="couponIdx" onChange={selectCoupon}>
                                        {datas && datas.map((coupon, index) => <option key={index} value={coupon.couponIdx}>{coupon.couponName}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr className="rc_coupon">
                                <td>유저 이름&nbsp;&nbsp;</td>
                                <td>
                                    <select id="userIdx" name="userIdx" onChange={selectUser}>
                                        {users && users.map((user, index) => <option key={index} value={user.userIdx}>유저 번호 : {user.userIdx}, 유저 이름 : {user.userName}</option>)}
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="rc_give_button">
                        <button type="submit" id="submit" onClick={handlerGiveCoupon}>지급</button>
                    </div>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default CouponRegist;