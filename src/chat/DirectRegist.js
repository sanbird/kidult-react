import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Navi from "../Navi";

import jwt_decode from "jwt-decode";


const DirectRegist = ({ match, history }) => {


    const { userIdx } = match.params;
    const [directIdx, setDirectIdx] = useState('');
    const [direct, setDirect] = useState([]);
    const [directName, setDirectName] = useState('');
    const [directContents, setDirectContents] = useState('');
    const [directImage, setDirectImage] = useState([]);
    const [directPrice, setDirectPrice] = useState('');
    const [directSeller, setDirectSeller] = useState('');

    const inputFiles = useRef();
    const MAX_FILE_SIZE = 1 * 1024 * 1024; //1MB
    const MAX_FILE_COUNT = 3;

    const handlerChangeDirectName = e => setDirectName(e.target.value);
    const handlerChangeDirectContents = e => setDirectContents(e.target.value);
    const handlerChangeDirectPrice = e => setDirectPrice(e.target.value);

    useEffect(() => {

        const token = sessionStorage.getItem('token');
        const decoded_token = jwt_decode(token);
        console.log(decoded_token);

        setDirectSeller(decoded_token.userIdx);


    }, [])


    const invalidFile = msg => {
        alert(msg);
        inputFiles.current.value = '';
        setDirectImage([]);
    };


    const handleChangeFile = e => {
        const files = e.target.files;

        if (files.length > MAX_FILE_COUNT) {
            invalidFile("이미지는 최대 3개 까지 업로드가 가능합니다.");
            return;
        }
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match("image/.*")) {
                invalidFile("이미지 파일만 업로드 가능합니다.");
                return;
            } else if (files[i].size > MAX_FILE_SIZE) {
                invalidFile("이미지 크기는 1MB를 초과할 수 없습니다.");
                return;
            }
        }

        setDirectImage([...files]);
    };

    let datas = {
        directName,
        directContents,
        directPrice,
        directSeller
    };

    const formData = new FormData();
    formData.append(
        'data',
        new Blob([JSON.stringify(datas)], { type: 'application/json' })
    );
    Object.values(directImage).forEach(file => formData.append('files', file));

    const handlerUploadDataWithFile = () => {
        axios({
            method: 'POST',
            url: `http://${process.env.REACT_APP_REST_API_SERVER_IP}:${process.env.REACT_APP_REST_API_SERVER_PORT}/registDirect`,
            headers: { 'Content-Type': 'multipart/form-data;' },
            data: formData
        })
            .then(response => {
                console.log(response);
                console.log(formData);
                alert(`정상적으로 업로드했습니다.`);
            })
            .catch(error => {
                console.log(error);
                alert(`업로드 중 오류가 발생했습니다.`);
            });
    };


    return (
        <>
            <div className="navi">
                <Navi />
            </div>

            <div className="rd_container">
                <div className="rd_head">
                    <h2>직거래 등록 페이지</h2>
                </div>
                <form id="frm" name="frm">
                    <table className="rd_table">
                        <tbody>
                            <tr className="rd_name">
                                <td>물품 이름</td>                               
                                <td><input type="text" id="directName" name="directName" value={directName} onChange={handlerChangeDirectName} 
                                placeholder="  이름을 입력하세요." style={{fontSize: "15px"}}/></td>
                            </tr>
                            <tr className="rd_image">
                                <td>물품 사진&nbsp;&nbsp;</td>
                                <td><input type="file" ref={inputFiles} onChange={handleChangeFile} multiple accept="image/*" /></td>
                            </tr>
                            <tr className="rd_price">
                                <td>물품 가격</td>
                                <td><input type="text" id="directPrice" name="directPrice" value={directPrice} onChange={handlerChangeDirectPrice} 
                                placeholder="  가격을 입력하세요." style={{fontSize: "15px"}} /></td>
                            </tr>                           
                            <tr className="rd_contents">
                                <td>물품 설명&nbsp;&nbsp;</td>
                                <td colSpan="2"><textarea id="directContents" name="directContents" value={directContents} onChange={handlerChangeDirectContents}></textarea></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="rd_button">
                        <button type="button" onClick={handlerUploadDataWithFile}>등록</button>
                    </div>
                </form>
            </div>
            <div className="footer">
                <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
            </div>           
        </>
    );
};

export default DirectRegist;