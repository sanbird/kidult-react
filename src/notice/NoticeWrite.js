import * as React from "react";
import { useEffect, useState } from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Space, Button } from 'antd';
import './NoticeWrite.css';
import Navi from "../Navi";

const NoticeWrite = ({ history }) => {

    const [noticeTitle, setTitle] = useState('');
    const [noticeContents, setContents] = useState('');
    const [createdId, setCreatedId] = useState('');

    const handlerChangeTitle = e => setTitle(e.target.value);
    const handlerChangeContents = e => setContents(e.target.value);

    const handlerNoticeSubmit = e => {
        e.preventDefault();
        axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/noticeWrite`, { noticeTitle, noticeContents })
            .then(response => {
                console.log(response);
                alert("공지사항이 정상적으로 등록되었습니다.");
                history.push('/notice');
            })
            .catch(error => console.log(error));
    };

    const handlerNoticeList = () => {
        console.log(history);
        history.push('/notice');
    };


    return (
        <>
            <div className="navi">
                <Navi />
            </div>
            <div className="write_container">
                <h2>글쓰기</h2>
                <form id="write_form" name="write_form" onSubmit={handlerNoticeSubmit}>
                    <table className="write_table">
                        <tbody className="write_top">
                            <tr>
                                <td className="write_title">제목&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <input type="text" className="write_title_box" value={noticeTitle} onChange={handlerChangeTitle} />
                                </td>
                                <td className="write_writer">작성자&nbsp;&nbsp;:&nbsp;&nbsp;admin</td>
                            </tr>
                        </tbody>
                        <tr className="write_bottom">
                            <td colSpan="2">
                                <CKEditor
                                    className="write_editor"
                                    value={noticeContents}
                                    editor={ClassicEditor}
                                    onReady={editor => {
                                        console.log('Editor is ready to use!', editor);
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setContents(data)
                                    }} />
                            </td>
                        </tr>
                    </table>
                    <div className="write_buttons">
                        <Button
                            onClick={handlerNoticeSubmit}
                            className="write_button"
                        >등록하기</Button>
                        <Button
                            onClick={handlerNoticeList}
                            className="write_toList"
                        >목록으로</Button>
                    </div>
                </form>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>
        </>
    );
};

export default NoticeWrite;
