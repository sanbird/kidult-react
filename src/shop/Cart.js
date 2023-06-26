import axios from "axios";
import { useEffect, useState } from "react";
import Navi from "../Navi";
import Pagination from "./Pagination";
import jwt_decode from "jwt-decode";

const Cart = ({ history }) => {

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
    const [cartIdx, setCartIdx] = useState('');
    const [cartPrice, setCartPrice] = useState('');
    const [paymentPrice, setPaymentPrice] = useState(0);
    const [purePrice, setPurePrice] = useState(0);
    const [shopImage, setShopImage] = useState(0);



    useEffect(() => {
        const token = sessionStorage.getItem('token');
        // if (!token) {
        //     alert('로그인 후 사용할 수 있습니다.');
        //     history.push('/main');
        //     return;
        // }        
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        let userIdx = decoded_token.userIdx;
        setUserIdx(userIdx);

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/cartList/${userIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                console.log(response.data.shopImage);
                console.log(response.data[0].cartIdx);
                setDatas(response.data);
                setCartIdx(response.data[0].cartIdx);
                setCartPrice(response.data[0].cartPrice);
                setShopImage(response.data[0].shopImage);

                let purePrice = 0;
                response.data.forEach(d => purePrice += d.cartPrice)
                console.log(purePrice);
                setPurePrice(purePrice);

                setPaymentPrice(purePrice);


            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });

    }, []);

    //결제 창 이동
    const handlerMovePayment = e => {
        alert('결제화면으로 이동합니다');
        history.push('/payment');
    };

    //카트 삭제
    const handlerDeleteCart = e => {
        console.log(cartIdx);
        axios.delete(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/deleteCart/${cartIdx}`)
            .then(response => {
                console.log(response)
                setDatas(response.data);
                window.location.reload();
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });
    }


    return (
        <>
            <div className="navi">
                <Navi />
            </div>
            <div className="cart_container">
                <div className="cart_head">
                    <h2>장바구니</h2>
                    <div className="cart_head_span">
                        <span>1.장바구니 </span>
                        <span style={{ color: "gray" }}>2.결제하기 </span>
                        <span style={{ color: "gray" }}>3.주문완료</span>
                    </div>
                </div>
                <table className="cart_list">
                    <colgroup>
                        <col width="15%" />
                        <col width="30%" />
                        <col width="10%" />
                        <col width="5%" />
                        <col width="10%" />
                        <col width="5%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">상품명</th>
                            <th scope="col">가격</th>
                            <th scope="col">수량</th>
                            <th scope="col">담은 날짜</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.length === 0 && (
                            <tr>
                                <td colSpan="6">일치하는 데이터가 없습니다.</td>
                            </tr>
                        )}
                        {currentPosts(datas) && currentPosts(datas).map(cart => (
                            <tr key={cart.cartIdx}>
                                <td><img src={`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/download?shopImage=` + cart.shopImage} width={80} height={80} /></td>
                                <td className="title">{cart.shopName}</td>
                                <td><p><span>{cart.shopPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><em> 원</em></p></td>
                                <td><p><span>{cart.cartCount}</span><em>개</em></p></td>
                                <td>{cart.cartDate}</td>
                                <td><img className="cart_del" src={`http://localhost:3000/img/del_icon.png`} onClick={handlerDeleteCart} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="cart_pay_container">
                    <div className="cart_pay">
                        <div className="cart_text">
                            <p>주문 금액<span>{purePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<em> 원</em></span></p>
                        </div>
                        <div className="cart_text">
                            <p>배송비<span>2,500<em> 원</em></span></p>
                        </div>
                        <div className="cart_text">
                            <p>적립 마일리지<span>+ {(purePrice * 0.05).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<em> 원</em></span></p>
                        </div>
                    </div>
                    <div className="cart_text_price">
                        <p>결제 예정 금액<span>{(purePrice + 2500).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<em> 원</em></span></p>
                    </div>
                    <div className="cart_button" onClick={handlerMovePayment}>
                        <p>결제하기</p>
                    </div>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default Cart;