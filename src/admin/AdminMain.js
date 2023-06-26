import { Link } from "react-router-dom/cjs/react-router-dom.min";
import AdminNavi from "./AdminNavi";
import "./Admin.css";

const AdminMain = ({ history }) => {

    return (
        <>
            <div >
                <div className="admin_navi">
                    <AdminNavi />
                </div>
                <div className="admin_sidebar">

                    <Link to="/shopRegist"><p>상품 등록</p></Link>
                    <Link to="/couponRegist"><p>쿠폰 등록</p></Link>
                    <Link to="/userList" ><p>유저 목록</p></Link>
                </div>
                <div className="admin_main">
                    {/* <UserList /> */}
                </div>
                <div className="footer">
                    <p style={{ marginRight: "30px", color: "white" }}>&copy; KidultGarten</p>
                </div>

            </div>
        </>
    );
};

export default AdminMain;