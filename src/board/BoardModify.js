import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useEffect, useState } from 'react';
import './BoardModify.css';
import { Button } from 'antd';
import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Navi from '../Navi';


function BoardModify({ match, history }) {
    const { boardIdx } = match.params;

    const [board, setBoard] = useState({});
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContents, setBoardContents] = useState('');
    const [boardCreatedId, setBoardCreatedId] = useState('');
    const [userIdx, setUserIdx] = useState('');
    const [user, setUser] = useState([]);
    const [userId, setUserId] = useState('');


    const handlerChangeTitle = e => setBoardTitle(e.target.value);
    const handlerChangeContents = e => setBoardContents(e.target.value);


    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);
        setUserId(decoded_token.sub);
        setUserIdx(decoded_token.userIdx);

        axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/boardModify/${boardIdx}`,
        { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                console.log('<<<<<<<<<<<<<<<<');
                setBoard(response.data);
                setBoardTitle(response.data.boardTitle);
                setBoardContents(response.data.boardContents);
                setBoardCreatedId(response.data.boardCreatedId);
                console.log(response.data.boardContents);
            })
            .catch(error => console.log(error));
    }, []);

    const handlerClickList = () => {
        console.log(history);
        history.push('/board');
    };

    const handlerClickUpdate = () => {

       

        console.log(boardIdx);
        console.log(boardContents);
        axios.put(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/boardModify/${boardIdx}`,  // 요청 URL
        { "boardTitle": boardTitle, "boardContents": boardContents, "boardCreatedId" : boardCreatedId },
        { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })           // 요청 본문을 통해서 서버로 전달할 값
            .then(response => {                                         // 200번대 응답코드가 반환되는 경우
                console.log(response);
                if (response.data === 1) {                              // 수정 결과에 대한 메시지 처리
                    alert('정상적으로 수정되었습니다.');
                    history.push('/board');
                } else {
                    alert('수정에 실패했습니다.');
                    return;
                }
            })
            .catch(error => {                                           // 200번대를 제외한 응답코드가 반환되는 경우
                console.log(error);
                alert(`수정에 실패했습니다. (${error.message})`);
                return;
            });
    };

    const handlerClickDelete = () => {

        console.log(boardIdx);
        axios.delete(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/boardDelete/${boardIdx}`,
        { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response);
                if (response.data !== 1) {
                    alert('정상적으로 삭제되었습니다.');
                    history.push('/board');				// 정상적으로 삭제되면 목록으로 이동
                } else {
                    alert('삭제에 실패했습니다.');
                    return;
                }
            })
            .catch(error => {
                console.log(error);
                alert(`오류가 발생했습니다. (${error.message})`);
                return;
            });
    };


    return (
        <>
            <div className="navi">
                <Navi />
            </div>
            <div className="write_container">
                <h2>수정 페이지</h2>
                <form id="write_form" name="write_form">
                    <table className="write_table">
                        <tbody className="write_top">
                            <input type="hidden" name="boardIdx" value={board.boardIdx} />
                            <tbody className="modify_info">
                                <td className="article_writer">작성자&nbsp;:&nbsp;{board.boardCreatedId}</td>
                                <td className="article_date">작성일&nbsp;:&nbsp;{board.boardCreatedDt}</td>
                                <td className="article_hit">조회수&nbsp;:{board.boardHitCnt}</td>
                            </tbody>
                            <tr>
                                <td className="write_title">제목&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input type="text" name="boardTitle" className="write_title_box" value={boardTitle} onChange={handlerChangeTitle} />
                                </td>
                            </tr>
                        </tbody>
                        <tr className="write_bottom">
                            <td colSpan="2">
                                <CKEditor                                 
                                    

                                    className="write_editor"
                                    value={boardContents}
                                    name="boardContents"
                                    editor={ClassicEditor}
                                    config={{placeholder: "수정할 내용을 입력하세요."}}
                                    onReady={editor => {
                                        console.log('Editor is ready to use!', editor);
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setBoardContents(data)
                                    }} />
                            </td>
                        </tr>
                    </table>
                    <div className="modify_buttons">
                        <Button className="modify_toList"
                            onClick={handlerClickList}>
                            목록으로
                        </Button>
                        <Button className="modify_toModify"
                            onClick={handlerClickUpdate}>
                            수정하기
                        </Button>
                        <Button className="modify_toRemove"
                            onClick={handlerClickDelete}>
                            삭제하기
                        </Button>
                    </div>
                </form>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
}

export default BoardModify;
