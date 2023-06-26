import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Notice.css';
import { Button, Pagination } from 'antd';
import Navi from '../Navi';
import noticeBanner from "../img/noticeBanner.jpg";


const Notice = ({ history }) => {

    const [datas, setDatas] = useState('');
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;
    const [userIdx, setUserIdx] = useState('');
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        setUserId(decoded_token.sub);
        setUserIdx(decoded_token.userIdx);

        let userIdx = decoded_token.userIdx;

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/notice`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                if (response.data) {
                    console.log(response);
                    setDatas(response.data);
                }
            })
            .catch(error => {
                console.log(error);
                // alert('로그인 후 사용하실 수 있습니다.')
                // history.push('/api/login');    
            });


    }, []);

    const handlerNoticeWrite = e => {
        if (userIdx == 1) {
            history.push(`/noticeWrite`);
        } else {
            alert('관리자만 작성 가능합니다')
        }
    }


    let total = datas.length;
    const numPages = Math.ceil(total / limit);

    return (
        <>
            <div className="navi">
                <Navi />
            </div>
            <div>
                <img className="notice_banner" src={noticeBanner} />
            </div>
            <div className="notice_container">
                <h2 className="notice_h">공지사항</h2>
                <table className="notice_list">
                    <colgroup>
                        <col width="5%" />
                        <col width="*" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="20%" />
                    </colgroup>
                    <thead>
                        <tr className="notice_topic">
                            <th scope="col">번호</th>
                            <th scope="col">제목</th>
                            <th scope="col">작성자</th>
                            <th scope="col">조회수</th>
                            <th scope="col">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            datas.length === 0 && (
                                <tr>
                                    <td colSpan="5">아직 글이 없습니다.</td>
                                </tr>
                            )
                        }
                        {datas && datas.slice(offset, offset + limit).map((notice, index) => (
                            <tr className="hotbox" key={index}>
                                <td> {notice.noticeIdx}</td>
                                <td className="title">
                                    <Link to={
                                        `/noticeDetail/${notice.noticeIdx}`}>{notice.noticeTitle}
                                    </Link>
                                </td>
                                {/* <td>{board.boardIdx}</td> */}
                                {console.log(offset + limit)}
                                <td>{notice.noticeCreatedId}</td>
                                <td>{notice.noticeHitCnt}</td>
                                <td>{notice.noticeCreatedDt}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
                <div>
                    {/* <a href="/api/write" className="board_write_btn board_write_btn_dark">글쓰기</a> */}
                    <Button
                        onClick={handlerNoticeWrite}
                        className="notice_write_btn_dark"
                    >글쓰기</Button>
                </div>
                <div className="notice_page">
                    <nav className="notice_page_num" >
                        <button className="notice_arrow_left" onClick={() => setPage(page - 1)} disabled={page === 1} >
                            &lt;
                        </button>
                        {Array(numPages)
                            .fill()
                            .map((page, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}>
                                    {i + 1}
                                </button>
                            ))}
                        <button className="notice_arrow_right" onClick={() => setPage(page + 1)} disabled={page === numPages}>
                            &gt;
                        </button>
                    </nav>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default Notice;
