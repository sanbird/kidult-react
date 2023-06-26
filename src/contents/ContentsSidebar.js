import { Link } from 'react-router-dom';

const ContentsSidebar = () => {

  return (
    <>
      <ul>
        <li><Link to="/contents/movie">영화</Link></li>
        /
        <li><Link to="/contents/anime">애니</Link></li>
      </ul>

    </>
  );

};

export default ContentsSidebar;