import * as React from "react";
import { useEffect, useState } from "react";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ConfigProvider, Button } from 'antd';

import './BoardWrite.css';
import Navi from "../Navi";

const BoardWrite = ({ history }) => {

  const [boardTitle, setBoardTitle] = useState('');
  const [boardContents, setBoardContents] = useState('');
  const [boardCreatedId, setBoardCreatedId] = useState('');
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

    axios.get(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/myInfo/${userIdx}`,
      { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
      .then(response => {
        console.log(response);
        setBoardCreatedId(response.data.userName);
      });
  }, []);

  const handlerChangeTitle = e => setBoardTitle(e.target.value);
  const handlerChangeContents = e => setBoardContents(e.target.value);

  const handlerSubmit = e => {
    e.preventDefault();
    axios.post(`http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/boardWrite`, { boardTitle, boardContents, boardCreatedId },
      { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
      .then(response => {
        console.log(response);
        alert("게시글이 정상적으로 등록되었습니다.");
        history.push('/board');
      })
      .catch(error => console.log(error));
  };

  const handlerClickList = () => {
    console.log(history);
    history.push('/board');
  };


  return (
    <>
      <div className="navi">
        <Navi />
      </div>
      <div className="write_container">
        <h2>글쓰기</h2>
        <form id="write_form" name="write_form" onSubmit={handlerSubmit}>
          <table className="write_table">
            <tbody className="write_top">
              <tr>
                <td className="write_title">&nbsp;제목&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="text" className="write_title_box" value={boardTitle} onChange={handlerChangeTitle} />
                </td>
                <td className="write_writer">작성자&nbsp;&nbsp;:&nbsp;&nbsp;{boardCreatedId}</td>
              </tr>
            </tbody>
            <tr className="write_bottom">
              <td colSpan="2">
                <CKEditor
                  className="write_editor"
                  value={boardContents}
                  editor={ClassicEditor}
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

          <div className="write_buttons">
            <ConfigProvider
              className="wirte_conpro"
              theme={{
                token: {
                  colorPrimary: '#FF6347'
                },
              }}>
              <Button
                onClick={handlerSubmit}
                className="write_button"
              >등록하기</Button>
              <Button
                onClick={handlerClickList}
                className="write_button"
              >목록으로</Button>
            </ConfigProvider>
          </div>
        </form>
      </div>
      <div className="footer">
        <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
      </div>
    </>
  );
};

export default BoardWrite;
