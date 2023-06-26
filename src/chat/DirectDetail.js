import axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Navi from "../Navi";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const DirectDetail = ({ match, history }) => {

    const { directIdx } = match.params;
    const [userIdx, setUserIdx] = useState('');
    const [direct, setDirect] = useState([]);
    const [directName, setDirectName] = useState('');
    const [directContents, setDirectContents] = useState('');
    const [directImage, setDirectImage] = useState('');
    const [directPrice, setDirectPrice] = useState('');
    const [directSeller, setDirectSeller] = useState('');

    const [idCheck, setIdCheck] = useState(false);
    const [checkChat, setCheckChat] = useState(false);

    const [chat, setChat] = useState([]);
    const [seller, setSeller] = useState('');
    const [buyer, setBuyer] = useState('');


    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);

        setUserIdx(decoded_token.userIdx);
        setBuyer(decoded_token.userIdx);

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/directDetail/${directIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response)
                setDirect(response.data);
                setDirectName(response.data.directName);
                setDirectContents(response.data.directContents);
                setDirectImage(response.data.directImage);
                setDirectPrice(response.data.directPrice);
                setDirectSeller(response.data.directSeller);
                setSeller(response.data.directSeller);
                console.log(response.data.directSeller);

                if (response.data.directSeller === decoded_token.userIdx) {
                    console.log(true);
                    setIdCheck(true);
                } else {
                    console.log(false);
                    setIdCheck(false);
                };
            })
            .catch(error => console.log(error));

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/chatroom`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                setChat(response.data);

                let chatRoomAvailble = false;
                let d = 0;
                for (d of response.data) {
                    if (d.buyer === userIdx && directIdx === d.directIdx) {
                        chatRoomAvailble = true;
                        setCheckChat(true);
                        break;
                    }
                };

            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handlerClickList = () => history.push('/directList');

    const handlerClickDelete = () => {
        if (idCheck === true) {
            axios.delete(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/deleteDirect/${direct.directIdx}`,
                { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
                .then(response => {
                    console.log(response)
                    if (response.data === 1) {
                        alert('정상적으로 삭제되었습니다.');
                        history.push(`/directList`);
                    } else {
                        alert('삭제에 실패했습니다.');
                        return;
                    }
                })
                .catch(error => {
                    console.log(error)
                    alert(`삭제에 실패했습니다.`);
                    return;
                });
        } else {
            alert('판매자만 삭제 가능합니다')
        }
    };


    // 채팅방 생성
    const goChat = e => {

        if (checkChat === false) {
            axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/chatroom`, { directIdx, seller, buyer },
                { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
                .then(response => {
                    console.log(response)
                    history.push(`/chatroom`);
                })
                .catch(error => console.log(error));
        } else {
            alert('이미 대화를 시작하였습니다.')
        }
    };


    return (
        <>
            <div className="navi">
                <Navi />
            </div>           
            <div className="direct_detail_container">
                <div className="direct_head">
                    <h2>물품 상세</h2>
                </div>

                <img className="direct_image" src={`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/downloadDirect?directImage=` + directImage} />
                <div className="detail_box">
                    <h1>{directName}</h1>
                    <div className="detail_price">
                        <p>가격 <span style={{ fontSize: "20px", color: "#FF6347" }}>{directPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span><em> 원</em></p>
                    </div>
                    <div className="detail_content">
                        {directContents}
                    </div>
                    <div className="detail_count">직거래 번호 <span style={{ fontSize: "20px", color: "#FF6347" }}>{directIdx}</span><em> 번</em></div>
                   
                    <div className="button-box">
                        <div className="detail_list" onClick={handlerClickList}><img src=""></img>목록으로</div>
                        <div className="detail_cart" onClick={goChat}><img src={`http://localhost:3000/img/list_cart_icon.png`} /> 채팅하기</div>
                    </div>
                </div>

            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );

};
export default DirectDetail;
