import axios from "axios";
import { useEffect, useState } from "react";
import Navi from "../Navi";
import jwt_decode from "jwt-decode";
import "./Shop.css";

const Payment = ({ history }) => {

    const [datas, setDatas] = useState([]);
    const [coupon, setCoupon] = useState([]);
    const [users, setUsers] = useState([]);
    const [userIdx, setUserIdx] = useState('');
    const [userId, setUserId] = useState('');
    const [cartIdx, setCartIdx] = useState('');

    const [cartPrice, setCartPrice] = useState('');
    const [currCash, setCurrCash] = useState('');
    const [mileage, setMileage] = useState(0);
    const [usedMileage, setUsedMileage] = useState(0);
    const [getMileage, setGetMileage] = useState('');

    const [ucIdx, setUcIdx] = useState('');
    const [paymentPrice, setPaymentPrice] = useState(0);
    const [purePrice, setPurePrice] = useState(0);

    const [couponName, setCouponName] = useState('');
    const [couponValue, setCouponValue] = useState(0);

    const [paymentName, setPaymentName] =  useState('');
    const [paymentAddress, setPaymentAddress] = useState('');
    const [paymentPhone, setPaymentPhone] =  useState('');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        setUserId(decoded_token.sub);
        let userIdx = decoded_token.userIdx;
        setUserIdx(decoded_token.userIdx);


        //카트 정보 불러오기
        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/cartList/${userIdx}`)
            .then(response => {
                console.log(response.data);
                setDatas(response.data);
                setCartPrice(response.data.cartPrice);
                setCartIdx(response.data[0].cartIdx);

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

        //쿠폰 정보 불러오기    
        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/coupon/${userIdx}`)
            .then(response => {
                console.log(response)
                setCoupon(response.data);
                setCouponName(response.data.couponName);
                setCouponValue(response.data.couponValue);
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });

        //마일리지 정보 불러오기
        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/myInfo/${userIdx}`)
            .then(response => {
                console.log(response);
                setUsers(response.data);
                setMileage(response.data.mileage);
                setCurrCash(response.data.cash);
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });
    }, []);

    const selectCoupon = (e => {
        console.log(purePrice);

        setUcIdx(e.target.value);
        console.log(e.target.value);

        const c = coupon.filter(c => c.ucIdx == e.target.value)
        console.log(c[0].couponValue);
        setCouponValue(c[0].couponValue);
        setPaymentPrice(purePrice - c[0].couponValue);

    });
    const handlerSetMileage = (e => {

        setUsedMileage(e.target.value);
        console.log(e.target.value);

    });

    const handlerUseMileage = (e => {
        setUsedMileage(usedMileage);
        console.log(usedMileage);
        console.log(users.mileage);

        if (usedMileage > users.mileage) {
            alert('보유 마일리지 이상 사용할 수 없습니다.')
        } else {
            setMileage(users.mileage - usedMileage + (purePrice * 0.1));
            console.log(users.mileage - usedMileage + (purePrice * 0.1));
            setPaymentPrice(paymentPrice - usedMileage);
        };

    });

    const handlerPaymentName = e => setPaymentName(e.target.value);
    const handlerPaymentPhone = e => setPaymentPhone(e.target.value);
    const handlerPaymentAddress = e => setPaymentAddress(e.target.value);

   
    //결제
    const handlerPay = (e => {



        e.preventDefault();


        let cash = 0;
        console.log(currCash);

        if (paymentPrice > currCash) {
            alert('보유 캐시 이상을 사용할 수 없습니다.');
        } else {
            cash = currCash - paymentPrice;
            console.log(cash);
        };

        console.log(cash);

        //카트 정보 변경       
        axios.put(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/updateCart/${userIdx}`, { userIdx })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });


        //결제 정보 등록
        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/registPayment`, { paymentPrice, paymentName, paymentPhone, paymentAddress, userIdx })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });


        //캐시 변경
        axios.put(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/updateCash/${userIdx}`, { userIdx, cash })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });

        //쿠폰 정보 등록
        axios.put(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/useCoupon/${ucIdx}`, { ucIdx })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });

        //마일리지 정보 등록
        axios.put(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/mileage/${userIdx}`, { userIdx, mileage })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
                if (error.response.status === 403) {
                    alert('접근 권한이 없습니다. 로그인 후 다시 접속해 주세요.')
                    history.push('/login');
                }
            });

        alert('결제를 진행합니다');
        history.push('/order');
    });

    return (
        <>
            <div className="navi">
                <Navi />
            </div>
            <div className="payment_container">
                <div className="payment_head">
                    <h2>결제하기</h2>
                    <div className="payment_head_span">
                        <span style={{ color: "gray" }}>1.장바구니 </span>
                        <span >2.결제하기 </span>
                        <span style={{ color: "gray" }}>3.주문완료</span>
                    </div>
                </div>
                <table className="payment_list">
                    <colgroup>
                        <col width="15%" />
                        <col width="30%" />
                        <col width="10%" />
                        <col width="5%" />
                        <col width="10%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">상품명</th>
                            <th scope="col">가격</th>
                            <th scope="col">수량</th>
                            <th scope="col">담은 날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datas.length === 0 && (
                            <tr>
                                <td colSpan="6">일치하는 데이터가 없습니다.</td>
                            </tr>
                        )}
                        {datas && datas.map(pay => (
                            <tr key={pay.cartIdx}>
                                <td><img src={`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/download?shopImage=` + pay.shopImage} width={80} height={80} /></td>
                                <td className="title">{pay.shopName}</td>
                                <td><p><span>{pay.shopPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><em> 원</em></p></td>
                                <td><p><span>{pay.cartCount}</span><em>개</em></p></td>
                                <td>{pay.cartDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="payment_pay_container">
                    <div className="payment_pay">
                        <div className="payment_text">
                            <p>주문 금액<span>{purePrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<em> 원</em></span></p>
                        </div>
                        <div className="payment_text">
                            <p>배송비<span>2,500<em> 원</em></span></p>
                        </div>
                        <div className="payment_text">
                            <p>적립 마일리지<span>+ {(purePrice * 0.05).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<em> 원</em></span></p>
                        </div>
                        <div className="payment_text">
                            <p>쿠폰 할인<span>- {couponValue}<em> 원</em></span></p>
                        </div>
                        <div className="payment_text">
                            <p>사용 마일리지<span>- {usedMileage}<em> 원</em></span></p>
                        </div>
                    </div>
                    <div className="payment_text_price">
                        <p>결제 예정 금액<span>{(paymentPrice + 2500).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<em> 원</em></span></p>
                    </div>
                    <div className="payment_button" onClick={handlerPay}>
                        <p>결제하기</p>
                    </div>
                </div>
            </div>
            <div className="pay_address">
                <h2>배송 정보</h2>
                <div className="address_text">
                    <p>받는 사람</p> <input type="text" placeholder="수령자 이름을 적어주세요" value={paymentName} onChange={handlerPaymentName}/>
                </div>
                <div className="address_text">
                    <p>전화번호</p> <input type="text" placeholder="전화번호를 적어주세요" value={paymentPhone} onChange={handlerPaymentPhone}/>
                </div>
                <div className="address_text">
                    <p>주소</p><input type="text" placeholder="수령 주소를 적어주세요" value={paymentAddress} onChange={handlerPaymentAddress}/>
                </div>
            </div>
            <div className="pay_box">
                <div className="pay_coupon">
                    <h2>쿠폰</h2>
                    <select id="selectCoupon" onChange={selectCoupon}>
                        {coupon.length === 0 && (
                            '쿠폰이 없습니다.'

                        )}
                        {coupon && coupon.map((coupon, index) => (
                            <option key={index} value={coupon.ucIdx}>{coupon.couponName} : {coupon.couponValue} 원</option>
                        ))}
                    </select>
                </div>
                <div className="pay_mileage">
                    <h2>마일리지</h2>
                    <p>현재 마일리지 : <span style={{ color: "#FF6347" }}>{users.mileage}</span> 원</p>
                    <input type="text" id="mileage" placeholder="사용할 마일리지를 입력해 주세요" value={usedMileage} onChange={handlerSetMileage} />
                    <input type="button" value="사용" onClick={handlerUseMileage} />
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default Payment;