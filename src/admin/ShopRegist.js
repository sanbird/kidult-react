import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./Admin.css";
import AdminNavi from "./AdminNavi";
import { Link } from "react-router-dom/cjs/react-router-dom";


const ShopRegist = ({ match, history }) => {


    const { userIdx } = match.params;
    const [shopIdx, setShopIdx] = useState('');
    const [shopName, setShopName] = useState('');
    const [shopContents, setShopContents] = useState('');
    const [shopPrice, setShopPrice] = useState('');
    const [shopCount, setShopCount] = useState('');
    const [shopCategory, setShopCategory] = useState([]);
    const [shopCategoryIdx, setShopCategoryIdx] = useState('');
    const [shopCategoryName, setShopCategoryName] = useState('');

    const inputFiles = useRef();
    const MAX_FILE_SIZE = 1 * 1024 * 1024; //1MB
    const MAX_FILE_COUNT = 3;

    const handlerChangeShopName = e => setShopName(e.target.value);
    const handlerChangeShopContents = e => setShopContents(e.target.value);
    const handlerChangeShopPrice = e => setShopPrice(e.target.value);
    const handlerChangeShopCount = e => setShopCount(e.target.value);
    const handlerChangeShopCategoryIdx = e => setShopCategoryIdx(e.target.value);



    const invalidFile = msg => {
        alert(msg);
        inputFiles.current.value = '';
        setShopImage([]);
    };

    const [shopImage, setShopImage] = useState([]);

    const handleChangeFile = e => {
        const files = e.target.files;

        if (files.length > MAX_FILE_COUNT) {
            invalidFile("이미지는 최대 3개 까지 업로드가 가능합니다.");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image/.*")) {
                invalidFile("이미지 파일만 업로드 가능합니다.");
                return;
            } else if (files[i].size > MAX_FILE_SIZE) {
                invalidFile("이미지 크기는 1MB를 초과할 수 없습니다.");
                return;
            }
        }

        setShopImage([...files]);
    };

    let datas = {
        shopName,
        shopContents,
        shopPrice,
        shopCount,
        shopCategoryIdx,
        shopCategoryName
    };

    const formData = new FormData();
    formData.append(
        'data',
        new Blob([JSON.stringify(datas)], { type: 'application/json' })
    );
    Object.values(shopImage).forEach(file => formData.append('files', file));

    const handlerUploadDataWithFile = () => {
        axios({
            method: 'POST',
            url: `http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/registShop`,
            headers: { 'Content-Type': 'multipart/form-data;' },
            data: formData
        })
            .then(response => {
                console.log(response);
                console.log(formData);
                alert(`정상적으로 업로드했습니다.`);
            })
            .catch(error => {
                console.log(error);
                alert(`업로드 중 오류가 발생했습니다.`);
            });
    };


    useEffect(() => {

        const token = sessionStorage.getItem('token');

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/shopCategory`)
            .then(response => {
                console.log(response.data);
                setShopCategory(response.data);
                setShopCategoryIdx(response.data.shopCategoryIdx);
                setShopCategoryName(response.data.shopCategoryName);
            })
            .catch(error => console.log(error));
    }, [])





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
            <div className="rs_container">
                <div className="rs_head">
                    <h2>상품 등록 페이지</h2>
                </div>

                <form id="frm" name="frm">
                    <table className="rs_table">
                        <tbody>
                            <tr className="rs_name">
                                <td>물품 이름</td>
                                <td><input type="text" id="shopName" name="shopName" value={shopName} onChange={handlerChangeShopName} 
                                placeholder="  이름을 입력하세요." style={{fontSize: "15px"}}/></td>
                            </tr>
                            <tr className="rs_image">
                                <td>물품 사진&nbsp;&nbsp;</td>
                                <td><input type="file" ref={inputFiles} onChange={handleChangeFile} multiple accept="image/*" /></td>
                            </tr>
                            <tr className="rs_price">
                                <td>물품 가격</td>
                                <td><input type="text" id="shopPrice" name="shopPrice" value={shopPrice} onChange={handlerChangeShopPrice} 
                                placeholder="  가격을 입력하세요." style={{fontSize: "15px"}} /></td>
                            </tr>
                            <tr className="rs_count">
                                <td>물품 수량</td>
                                <td><input type="text" id="shopCount" name="shopCount" value={shopCount} onChange={handlerChangeShopCount} 
                                placeholder="  수량을 입력하세요." style={{fontSize: "15px"}} /></td>
                            </tr>
                            <tr className="rs_category">
                                <td>물품 종류&nbsp;&nbsp;</td>
                                <td>
                                    <select id="shopCategory" name="shopCategory" onChange={handlerChangeShopCategoryIdx}>
                                        {shopCategory && shopCategory.map((cat, index) => <option key={index} value={cat.shopCategoryIdx}>{cat.shopCategoryName}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr className="rs_contents">
                                <td>물품 설명&nbsp;&nbsp;</td>
                                <td colSpan="2"><textarea id="shopContents" name="shopContents" value={shopContents} onChange={handlerChangeShopContents}></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="rs_button">
                        <button type="button" onClick={handlerUploadDataWithFile}>등록</button>
                    </div>
                </form>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default ShopRegist;