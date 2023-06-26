import axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Navi from "../Navi";
import "./Shop.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import minusIcon from "./img/minus_icon.png";
// import cartIcon from "./img/list_cart_icon.jpg";

const ShopDetail = ({ match, history }) => {

    const { shopIdx } = match.params;
    const [userIdx, setUserIdx] = useState('');
    const [shop, setShop] = useState([]);
    const [shopName, setShopName] = useState('');
    const [shopContents, setShopContents] = useState('');
    const [shopCategoryName, setShopCategoryName] = useState('');
    const [shopImage, setShopImage] = useState('');
    const [shopPrice, setShopPrice] = useState('');
    const [shopCount, setShopCount] = useState('');
    const [cartPrice, setCartPrice] = useState('');
    const [cartCount, setCartCount] = useState('1');

    const count = new Array(shopCount).fill(0);


    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);

        setUserIdx(decoded_token.userIdx);

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/shopDetail/${shopIdx}`)
            .then(response => {
                console.log(response)
                setShop(response.data);
                setShopCount(response.data.shopCount);
                setShopName(response.data.shopName);
                setShopContents(response.data.shopContents);
                setShopImage(response.data.shopImage);
                setShopPrice(response.data.shopPrice);
                setShopCount(response.data.shopCount);
                setShopCategoryName(response.data.shopCategoryName);
            })
            .catch(error => console.log(error));
    }, []);

    const handlerClickList = () => history.push('/shopList');
    const handlerSetCartCount = e => setCartCount(e.target.value);
    const handlerMinus = e => {
        if (cartCount < 2) {
            alert('1개 이상 구매하여야 합니다.');
            return setCartCount(1);
        }
        setCartCount(cartCount - 1);
    }
    const handlerPlus = e => setCartCount(Number(cartCount) + 1);

    const handlerAddCart = e => {

        let cartPrice = (shop.shopPrice * cartCount);

        console.log(cartPrice);

        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/registCart`, { shopIdx, cartPrice, cartCount, userIdx })
            .then(response => {
                console.log(response)
                alert('장바구니로 이동합니다');
                history.push('/cart')

            })
            .catch(error => console.log(error));
    };

    return (
        <>
            <div className="navi">
                <Navi />
            </div>
           
            <div className="shop_detail_container">
                <div className="detail_head">
                    <h2>물품 상세</h2>
                </div>

                <img className="shop_image" src={`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/download?shopImage=` + shopImage} />
                <div className="detail_box">
                    <div className="shop_detail">
                        <h1 style={{fontSize: "25px"}}>{shopName}</h1>
                        <p>분류 : {shopCategoryName}</p>
                        <div className="detail_price">
                            <p>가격 <span style={{fontSize : "20px", color : "#FF6347"}}>{shopPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><em> 원</em></p>
                        </div>
                        <div className="detail_content">
                            {shopContents}
                        </div>
                        <div className="detail_count">총 수량 <span style={{fontSize : "20px", color : "#FF6347"}}>{shopCount}</span><em> 개</em></div>
                        <div className="detail_add_container">
                            <div className="detail_add">
                                <span className="minus_btn" onClick={handlerMinus}></span>
                                <input name="count" type="text" className="no_div" value={cartCount} />
                                <span className="plus_btn" onClick={handlerPlus}></span>
                                <div className="total_price">
                                    <span>{(shopPrice * cartCount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><em> 원</em>
                                </div>
                            </div>
                        </div>
                        <div className="all_price_container">
                            <div className="all_price">총 상품금액 <span style={{fontSize : "30px", color : "#FF6347"}}>{(shopPrice * cartCount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><em>원</em></div>
                        </div>
                        <div className="button-box">
                            <div className="detail_list" onClick={handlerClickList}><img src=""></img>목록으로</div>
                            <div className="detail_cart" onClick={handlerAddCart}><img src={`http://localhost:3000/img/list_cart_icon.png`}/> 장바구니</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );

};
export default ShopDetail;
