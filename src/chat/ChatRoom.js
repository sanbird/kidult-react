
import { useEffect, useState } from 'react';
import './Chat.css';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Navi from '../Navi';
import Chatting from './Chatting';

const ChatRoom = () => {

  const [chatSell, setChatSell] = useState([]);
  const [chatBuy, setChatBuy] = useState([]);


  useEffect(() => {

    const token = sessionStorage.getItem('token');
    const decoded_token = jwt_decode(token);
    console.log(decoded_token);

    let seller = decoded_token.userIdx;
    let buyer = decoded_token.userIdx;

    axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/chatSell/${seller}`,
      { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
      .then(res1 => {
        console.log(res1);
        let temp = [];
        for (let i = 0; i < res1.data.length; i++) {
          temp[i] = false;
        }
        setState(temp);
        console.log(temp)
        setChatSell(res1.data);
      })
      .catch(error => {
        console.log(error);
      });

    axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/chatBuy/${buyer}`,
      { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
      .then(res2 => {
        console.log(res2);
        setChatBuy(res2.data);
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  const [state, setState] = useState([]);

  const handlerState = (index) => {

    let tempState = [...state];
    if (tempState[index] == true) {
      tempState[index] = false;
    } else {
      tempState[index] = true;
    }
    setState(tempState);
  }

  return (
    <>
      <div className="navi">
        <Navi />
      </div>
      <div className="chat_sidebar">
        <Link to="/myPage"><p>내 정보</p></Link>
        <Link to="/order"><p>주문내역</p></Link>
        <Link to="/chatroom"><p>채팅방</p></Link>
        <Link to="/cart"><p>장바구니</p></Link>
      </div>
      <div className="chat_container">
        <div className="chat_sell">
          <h1>판매 채팅방</h1>
          {chatSell.map((chat, index) => (
            <div className="sell_box" key={index}>
              <p><Link to={`/chatting/${chat.chatroomIdx}`} style={{ color: "black" }}>{chat.directName} : {chat.chatroomIdx}번 채팅방</Link></p>
            </div>
          ))}
        </div>
        <div className="chat_buy">
          <h1>구매 채팅방</h1>
          {chatBuy.map((chat, index) => (
            <div className="buy_box" key={index}>
              <p><Link to={`/chatting/${chat.chatroomIdx}`} style={{ color: "black" }}>{chat.directName} : {chat.chatroomIdx}번 채팅방</Link></p>

            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
      </div>
    </>
  );
}

export default ChatRoom;