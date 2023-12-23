import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
  <div> 
    <nav className="nav-header">
        <NavLink style={{ textDecoration: "none" }} exact to="/">
            <div className="logo-div">
                <i className="fa-solid fa-house"></i>&nbsp;&nbsp;
                <div style={{ paddingTop: "8px" }}>Vacation Home</div>       
            </div> 
        </NavLink>
      {isLoaded && (
        <div className='menu'>
          <div>
              {sessionUser && 
              <NavLink style={{ textDecoration: "none" }} className="create-new-spot" 
              exact to="/spots/new">Create a New Spot</NavLink>}&nbsp;&nbsp;&nbsp;
          </div>
          <div>
              <ProfileButton user={sessionUser} />
          </div>
        </div>
      )}

  </nav>
  </div> 
    
  );
}

export default Navigation;