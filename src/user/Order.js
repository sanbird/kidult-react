import axios from "axios";
import { useEffect, useState } from "react";
import Navi from "../Navi";
import Pagination from "./Pagination";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./MyPage.css";

const Order = ({ history }) => {

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


    const [userIdx, setUserIdx] = useState('');
   

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        let userIdx = decoded_token.userIdx;
        

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/paymentList/${userIdx}`)
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
            <div className="mp_sidebar">
                <Link to="/myPage"><p>내 정보</p></Link>                
                <Link to="/order"><p>주문내역</p></Link>
                <Link to="/chatroom"><p>채팅방</p></Link>                
                <Link to="/cart"><p>장바구니</p></Link>
            </div>
            <div className="order_container">
                <h2>결제 목록</h2>
                <table className="order_list">
                    <colgroup>
                        <col width="5%" />
                        <col width="10%" />
                        <col width="10%" />
                        <col width="20%" />                        
                        <col width="10%" />
                        <col width="10%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">결제 번호</th>
                            <th scope="col">결제 날짜</th>
                            <th scope="col">주문자</th>
                            <th scope="col">배송 주소</th>
                            <th scope="col">주문자 전화번호</th>
                            <th scope="col">결제 가격</th>                           
                        </tr>
                    </thead>
                    <tbody>
                        {datas.length === 0 && (
                            <tr>
                                <td colSpan="6">결제 내역이 없습니다.</td>
                            </tr>
                        )}
                        {currentPosts(datas) && currentPosts(datas).map(order => (
                            <tr key={order.paymentIdx}>
                                <td>{order.paymentIdx}</td>
                                <td>{order.paymentDate}</td>                                  
                                <td>{order.paymentName}</td>  
                                <td>{order.paymentAddress}</td>  
                                <td>{order.paymentPhone}</td>
                                <td>{order.paymentPrice}</td> 
                            </tr>
                        ))}
                    </tbody>
                </table>                         
            </div>
        </>
    );
};

export default Order;