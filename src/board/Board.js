import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Board.css';
import { Button, ConfigProvider, Pagination } from 'antd';
import Navi from '../Navi';
import commuBanner from "../img/commuBanner.jpg";

const Board = () => {

    const [datas, setDatas] = useState('');
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const offset = (page - 1) * limit;
    const [userIdx, setUserIdx] = useState('');
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState('');


    //게시판 리스트 조회
    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        setUserId(decoded_token.sub);
        setUserIdx(decoded_token.userIdx);

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/boardList`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                if (response.data) {
                    console.log(response);
                    setDatas(response.data);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    //페이징 함수 정의
    let total = datas.length;
    const numPages = Math.ceil(total / limit);

    return (
        <>
            <div className="navi">
                <Navi />
            </div>
            <div>
                <img className="commu_banner" src={commuBanner} />
            </div>
            <div className="board_container">
                <h2 className="board_h">자유게시판</h2>
                <table className="board_list">
                    <colgroup>
                        <col width="5%" />
                        <col width="*" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="20%" />
                    </colgroup>
                    <thead>
                        <tr className="board_topic">
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
                        {/* map 반복문으로 10개단위로 리스트 정렬 */}
                        {datas && datas.slice(offset, offset + limit).map((board, index) => (
                            <tr className="hotbox" key={index}>
                                <td> {board.boardIdx}</td>
                                <td className="title">
                                    <Link to={
                                        `/boardDetail/${board.boardIdx}`}>{board.boardTitle}
                                    </Link>
                                </td>
                                {console.log(offset + limit)}
                                <td>{board.boardCreatedId}</td>
                                <td>{board.boardHitCnt}</td>
                                <td>{board.boardCreatedDt}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
                <div>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#FF6347'
                            },
                        }}>
                        <Button
                            href="/boardWrite"
                            className="board_write_btn_dark">글쓰기
                        </Button>
                    </ConfigProvider>
                </div>
                <div className="board_page">
                    <nav className="board_page_num" >
                        <button className="board_arrow_left" onClick={() => setPage(page - 1)} disabled={page === 1} >
                            &lt;
                        </button>
                        {/* 페이징 함수 호출 */}
                        {Array(numPages)
                            .fill()
                            .map((page, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    aria-current={page === i + 1 ? "page" : null}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        <button className="board_arrow_right" onClick={() => setPage(page + 1)} disabled={page === numPages}>
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

export default Board;
