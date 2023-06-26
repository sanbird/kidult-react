import React, { useCallback, useRef, useState, useEffect } from 'react';
import './Chatting.css';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import jwt_decode from "jwt-decode";
import axios from 'axios';


const Chatting = ({match, history}) => {
    // 상태 변수 정의
    // -----------------------------------------------------------------------------------------
    // isJoin       채팅 참가 여부
    //              초기값은 false이며 연결 후 JOIN 메시지를 수신했을 때 true로 설정합니다.
    //              채팅 참가 후 닉네임을 변경할 수 없도록 하기 위해 사용합니다.
    // chatHistory  [ { type, sender, message }, { ... }, ... ] 형식의 채팅 내용을 저장하는 배열
    // sender       사용자 이름
    // message      사용자가 작성한 채팅 내용
    // const [isJoin, setIsJoin] = useState(false);
    // const [chatHistory, setChatHistory] = useState([]);
    const [isJoin, setIsJoin] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [sender, setSender] = useState('');
    const [message, setMessage] = useState('');

    const { chatroomIdx } = match.params;
    // const {handlerState ,index } = props;

    // ref 변수 정의
    // -----------------------------------------------------------------------------------------
    // refDialogDiv     채팅 내용 출력 영역을 자동 스크롤하기 위해서 사용합니다.
    // refSenderInput   사용자 이름 입력 창에 포커스를 부여하기 위해서 사용합니다.
    // refMessageInput  채팅 내용 입력 창에 포커스를 부여하기 위해서 사용합니다.
    // stompClient      스톰프 클라이언트의 상태를 유지시키지 위해서 사용합니다.
    const refDialogDiv = useRef();
    // const refSenderInput = useRef();
    const refMessageInput = useRef();
    const stompClient = useRef(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);


        let userIdx = decoded_token.userIdx;

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/myInfo/${userIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                setSender(response.data.userName);
            });
    }, []);

    const joinChatting = useCallback((e) => {
        e.preventDefault();

        stompClient.current = Stomp.over(() => new SockJS(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/ws/${chatroomIdx}`));
        stompClient.current.connect({}, onConnected, onError);
    }, [sender]);


    const onConnected = useCallback(() => {

        stompClient.current.subscribe(`/topic/chatting/${chatroomIdx}`, onMessageReceived);
        stompClient.current.send(`/app/chat.addUser/${chatroomIdx}`, {}, JSON.stringify({ sender, type: 'JOIN', chatroomIdx }));
    }, [sender]);


    const onError = useCallback(error => {
        console.log('연결실패', error);
    }, []);


    const sendMessage = useCallback(e => {
        e.preventDefault();

        if (stompClient) {
            stompClient.current.send(`/app/chat.sendMessage/${chatroomIdx}`, {}, JSON.stringify({ sender, message, type: 'CHAT', chatroomIdx }));
        }

        setMessage('');
        refMessageInput.current.focus();
    }, [message]);


    const onMessageReceived = useCallback(payload => {
        const message = JSON.parse(payload.body);

        if (message.type === 'JOIN' && message.sender === sender) {
            setIsJoin(true);
            console.log(message);
            message.history.map(msg => setChatHistory(chatHistory => [...chatHistory, msg]))
        } else {
            setChatHistory(chatHistory => [...chatHistory, message]);
        }
    }, [sender]);


    useEffect(() => {
        refDialogDiv.current.scroll({
            top: refDialogDiv.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [chatHistory])

    const handlerOut = e => {
       history.push('/chatroom');
    }

    return (
        <>
            <div id='chat-wrap'>
                <div id='chat'>
                    <div id='dialog' ref={refDialogDiv}>
                        <div className='dialog-board'>
                            {   /* 채팅 내용을 출력 */
                                chatHistory.map((item, idx) => (
                                    <div key={idx} className={item.sender === sender ? 'me' : 'other'}>
                                        <span><b>{item.sender}</b></span>
                                        <span className="date">{item.createdDt}</span><br />
                                        <span>{item.message}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div id='divSender'>
                        <p >이름 : <span style={{color: "#FF6347"}}>{sender}</span></p>                          
                        <input type='button' value='참가' id='btnJoin' disabled={isJoin} onClick={joinChatting} />
                        <input type='button' value='나가기' id='btnOut' onClick={handlerOut} />
                    </div>
                    <div id='divMessage'>
                        <label>메시지</label>
                        <textarea id='messageInput' value={message} ref={refMessageInput}
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={e => { if (e.keyCode === 13) { sendMessage(e); } }}></textarea>
                        <input type='button' value='전송' id='btnSend' onClick={sendMessage} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatting;