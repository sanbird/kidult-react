import axios from 'axios';
import { useState, useEffect } from 'react';
import './CommentList.css';
import deleteButton from '../img/deleteButton.png';
import { Button, ConfigProvider } from 'antd';
import jwt_decode from "jwt-decode";



const CommentList = (props) => {

    const boardIdx = props.boardIdx;
    const [comments, setComments] = useState([]);
    const [commentContents, setCommentContents] = useState('');
    const [commentIdx, setCommentIdx] = useState(0);
    const [commentCreatedId, setCommentCreatedId] = useState('');

    const [userIdx, setUserIdx] = useState('');
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState('');

    const [value, setValue] = useState('');
    const submitHandler = e => setValue(e.target.value);

    const onChangeHandler = (e) => {
        setCommentContents(e.target.value);
    }

    //댓글 불러오기
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        setUserId(decoded_token.sub);
        setUserIdx(decoded_token.userIdx);

        let userIdx = decoded_token.userIdx;

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/myInfo/${userIdx}`,
            { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                setCommentCreatedId(response.data.userName);
            });

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/comment/${boardIdx}`)
            .then(response => {
                console.log(response);
                setComments(response.data);
            })
            .catch(error => console.log(error));
    }, [boardIdx]);

    //댓글 쓰기
    const CommentSubmit = () => {
        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/insertcomment/${boardIdx}`, { commentCreatedId, commentContents, boardIdx })
            .then(response => {
                console.log(response);
                alert("댓글이 정상적으로 등록되었습니다.");
                window.location.reload();
            })
            .catch(error => console.log(error));
    };

    //댓글 삭제
    const handlerCommentDelete = (commentIdx) => {
        setCommentIdx(commentIdx);
        axios.put(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/deletecomment/${commentIdx}`)
            .then(response => {
                console.log(response);
                alert("댓글이 삭제되었습니다.")
                window.location.reload();
            })
            .catch(error => console.log(error));
    };


    return (
        <div className="comment_list">
            <table className="comment_table">
                <textarea
                    className="comment_input"
                    type="text"
                    placeholder="댓글을 작성하세요"
                    onChange={onChangeHandler} />
                <ConfigProvider
                    theme={{
                        token: {
                            colorPrimary: '#FF6347'
                        },
                    }}>
                    <Button
                        onClick={CommentSubmit}
                        className="comment_btn">등록</Button>
                </ConfigProvider>
            </table>

            <table className="comment_cmt">
                {comments.length === 0 && (
                    <tr>
                        <td colSpan="4">댓글 없음</td>
                    </tr>
                )}

                {comments && comments.map(comments => (
                    <>
                        <tr className="comment_title"
                            key={comments.commentIdx}>
                            <th className="comment_id">{comments.commentCreatedId}</th>
                            <td className="comment_date">{comments.commentCreatedDt}</td>
                            {/* 삭제버튼 */}
                            <img src={deleteButton}
                                className="comment_delete"
                                alt="Delete"
                                onClick={() => handlerCommentDelete(comments.commentIdx)} />
                        </tr>
                        <tr className="comment_contents">{comments.commentContents}</tr>
                    </>
                ))}
            </table>
        </div>
    );

};

export default CommentList;
