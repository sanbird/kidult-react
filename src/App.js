
import { Route } from 'react-router-dom';
import Main from './Main';
import Login from './user/Login';
import Join from './user/Join';
import MyPage from './user/MyPage';
import UserList from './admin/UserList';
import ShopRegist from './admin/ShopRegist';
import ShopList from './shop/ShopList';
import ShopDetail from './shop/ShopDetail';
import AdminMain from './admin/AdminMain';
import CouponRegist from './admin/CouponRegist';
import Cart from './shop/Cart';
import Payment from './shop/Payment';
import Order from './user/Order';
import Chatting from './chat/Chatting';
import DirectList from './chat/DirectList';
import DirectDetail from './chat/DirectDetail';
import ChatRoom from './chat/ChatRoom';
import DirectRegist from './chat/DirectRegist';
import Board from './board/Board';
import BoardWrite from './board/BoardWrite';
import BoardDetail from './board/BoardDetail';
import BoardModify from './board/BoardModify';
import CommentList from './comment/CommentList';
import ContentsMovie from './contents/ContentsMovie';
import ContentsMovieDetail from './contents/ContentsMovieDetail';
import ContentsAnime from './contents/ContentsAnime';
import ContentsAnimeDetail from './contents/ContentsAnimeDetail';
import Notice from './notice/Notice';
import NoticeDetail from './notice/NoticeDetail';
import NoticeWrite from './notice/NoticeWrite';


function App() {
  return (
    <>
      {/* <Route path="/" component={Main} exact={true} /> */}
      <Route path="/main" component={Main} exact={true} />
      <Route path="/login" component={Login} exact={true} />
      <Route path="/join" component={Join} exact={true} />
      <Route path="/myPage" component={MyPage} exact={true} />
      <Route path="/order" component={Order} exact={true}/>

      

      {/* 관리자 페이지 */}
      <Route path="/admin" component={ShopRegist} exact={true} />
      <Route path="/userList" component={UserList} exact={true} />
      <Route path="/shopRegist" component={ShopRegist} exact={true} />
      <Route path="/couponRegist" component={CouponRegist} exact={true} />
 
      

      {/* 쇼핑몰 */}
      <Route path="/shopList" component={ShopList} exact={true} />
      <Route path="/shopDetail/:shopIdx" component={ShopDetail} exact={true} />
      <Route path="/cart" component={Cart} exact={true} />
      <Route path="/payment" component={Payment} exact={true} />

      {/* 커뮤니티 */}
      <Route path="/board" component={Board} exact={true} />
      <Route path="/boardWrite" component={BoardWrite} exact={true} />
      <Route path="/boardDetail/:boardIdx" component={BoardDetail} exact={true} />
      <Route path="/boardModify/:boardIdx" component={BoardModify} exact={true} />
      <Route path="/comment/:boardIdx" component={CommentList} exact={true} />

      {/* 컨텐츠 */}
      <Route path="/movie" component={ContentsMovie} exact={true} />
      <Route path="/movieDetail/:rank" component={ContentsMovieDetail} exact={true} />
      <Route path="/anime" component={ContentsAnime} exact={true} />
      <Route path="/animeDetail/:animeIdx" component={ContentsAnimeDetail} exact={true} />

      {/* 공지사항 */}
      <Route path="/notice" component={Notice} exact={true} />
      <Route path="/noticeDetail/:noticeIdx" component={NoticeDetail} exact={true} />
      <Route path="/noticeWrite" component={NoticeWrite} exact={true} />


      {/* 직거래 */}      
      <Route path="/chatroom" component={ChatRoom} exact={true}/>
      <Route path="/chatting/:chatroomIdx" component={Chatting} exact={true} />
      <Route path="/directList" component={DirectList} exact={true} />
      <Route path="/directRegist" component={DirectRegist} exact={true} />
      <Route path="/directDetail/:directIdx" component={DirectDetail} exact={true} />

    </>
  );
}

export default App;
