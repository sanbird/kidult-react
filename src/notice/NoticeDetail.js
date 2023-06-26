import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useEffect, useState } from 'react';
import './NoticeDetail.css';
import { Button } from 'antd';
import Parser from 'html-react-parser';
import Navi from '../Navi';


function NoticeDetail({ match, history }) {
    console.log(typeof 'NoticeContents')

    const { noticeIdx } = match.params;

    const [notice, setNotice] = useState([]);
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeContents, setNoticeContents] = useState('');
    //const [ comments, setComments ] = useState([]);
    const [noticeCreatedId, setNoticeCreatedId] = useState('');
    const [userIdx, setUserIdx] = useState('');
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        setUserId(decoded_token.sub);
        setUserIdx(decoded_token.userIdx);

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/noticeDetail/${noticeIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                console.log('<<<<<<<<<<<<<<<<');
                setNotice(response.data);
                setNoticeTitle(response.data.noticeTitle);
                setNoticeContents(response.data.noticeContents);
            })
            .catch(error => console.log(error));

    }, []);

    const handlerClickList = () => {
        console.log(history);
        history.push('/notice');
    };

    const handlerClickUpdate = () => {
        console.log(history);
        history.push(`/noticeModify/${noticeIdx}`)
    }

    return (
        <>
            <div className="navi">
                <Navi />
            </div>
            <div className="board_detail">
                <div className="detail_container">
                    <h2>상세페이지</h2>
                    <form action="" method="POST" id="frm" name="frm">
                        <input type="hidden" name="boardIdx" />
                        <tbody className="article_info">
                            <td className="article_writer">작성자&nbsp;:&nbsp;{notice.noticeCreatedId}</td>
                            <td className="article_date">작성일&nbsp;:&nbsp;{notice.noticeCreatedDt}</td>
                            <td className="article_hit">조회수&nbsp;:{notice.noticeHitCnt}</td>

                        </tbody>
                    </form>
                </div>
                <div className="detail_contents">
                    <tr className="article_title">{notice.noticeTitle}</tr>
                    <td>{notice.noticeContents == null ? "" : Parser(notice.noticeContents)}</td>
                </div>
                <div className="detail_buttons">
                    <Button type="primary" className="detail_button"
                        onClick={handlerClickList}>목록으로</Button>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
}

export default NoticeDetail;
