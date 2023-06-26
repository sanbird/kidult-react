import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useEffect, useState } from 'react';
import CommentList from '../comment/CommentList';
import './BoardDetail.css';
import { Button, ConfigProvider } from 'antd';
import Parser from 'html-react-parser';
import Navi from '../Navi';


function BoardDetail({ match, history }) {
    console.log(typeof 'BoardContents')
    const { boardIdx } = match.params;
    const [board, setBoard] = useState([]);
    const [boardTitle, setTitle] = useState('');
    const [boardContents, setContents] = useState('');
    const [comments, setComments] = useState([]);
    const [boardCreatedId, setBoardCreatedId] = useState('');
    const [userIdx, setUserIdx] = useState('');
    const [user, setUser] = useState([]);
    const [userName, setUserName] = useState('');


    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        setUserIdx(decoded_token.userIdx);

        let userIdx = decoded_token.userIdx;

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/myInfo/${userIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                setUserName(response.data.userName);
            });

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/boardDetail/${boardIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                console.log('<<<<<<<<<<<<<<<<');
                setBoard(response.data);
                setTitle(response.data.boardTitle);
                setContents(response.data.boardContents);
            })
            .catch(error => console.log(error));

    }, []);

    const getCommentList = () => {
        axios.get(`http://http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/comment/${boardIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error));
    };

    useEffect(() => {
        getCommentList();
    }, []);


    const handlerClickList = () => {
        console.log(history);
        history.push('/board');
    };

    const handlerClickUpdate = () => {
        if (userName != board.boardCreatedId) {
            alert(`작성자만 수정할 수 있습니다.`);
        } else {
            console.log(history);
            history.push(`/boardModify/${boardIdx}`)
        }
    }



    return (
        <>
            <div className="navi">
                <Navi />
            </div>

            <div className="board_detail">
                <div className="detail_container">
                    <h2>게시판 상세</h2>
                    <form action="" method="POST" id="frm" name="frm">
                        <input type="hidden" name="boardIdx" />
                        <tbody className="article_info">
                            <td className="article_writer">작성자&nbsp;:&nbsp;{board.boardCreatedId}</td>
                            <td className="article_date">작성일&nbsp;:&nbsp;{board.boardCreatedDt}</td>
                            <td className="article_hit">조회수&nbsp;:{board.boardHitCnt}</td>
                        </tbody>
                    </form>
                </div>

                <div className="detail_contents">
                    <tr className="article_title">{board.boardTitle}</tr>
                    <td>{board.boardContents == null ? "" : Parser(board.boardContents)}</td>
                </div>

                <div className="detail_comment">
                    <h4>댓글</h4>
                    <input type="hidden" name="boardIdx2" />
                    <table className="board_detail2">
                        <tbody>
                            <tr>
                                {/* 댓글 컴포넌트 임포트 */}
                                <CommentList boardIdx={board.boardIdx} comments={comments} getCommentList={getCommentList} />
                            </tr>
                        </tbody>
                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: '#FF6347'
                                },
                            }}>
                            <div className="detail_buttons">
                                <Button type="primary" className="detail_toList"
                                    onClick={handlerClickList}>목록으로</Button>
                                <Button type="default" className="detail_toUpdate"
                                    onClick={handlerClickUpdate}>수정하기</Button>
                            </div>
                        </ConfigProvider>
                    </table>
                </div>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
}

export default BoardDetail;
