import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { NavLink, useNavigate } from 'react-router-dom';


function ProfileButton({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
    
      <button className="profile-menu-button" onClick={toggleMenu}>
          <i className="fa-solid fa-bars" />&nbsp;&nbsp;
          <i className="fa-regular fa-user" />  
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
        <>
          <div style={{ display: "flex",alignContent:"center", justifyContent:"center",flexDirection: "column",paddingBottom: "5px", paddingLeft: "5px", paddingRight: "5px", border: "solid 2px", borderTop: "solid 2px"}}> <br></br>
            <div>Hello, {user.firstName} </div>
            <div>{user.email}</div>
          </div>
            <div style={{width:"100%", borderRight: "solid 2px", borderBottom: "solid 2px",marginRight: "0px", paddingRight: "0px"}}> 
            <NavLink style={{marginRight: "0px", padding: "2px",textDecoration:"none", color: "black",   borderLeft: "solid 2px", alignItems: "center"}}
              className="manage-spot-link"
              exact
              to="/spots/current"
              onClick={closeMenu}
            >
              Manage Spots
            </NavLink>
          </div>
          <div style={{display: "flex",alignContent:"center", justifyContent:"center", padding: "5px", borderBottom: "solid 2px", borderRight: "solid 2px", borderLeft: "solid 2px", paddingBottom: "0px"}}>
              <button className="logout-button" onClick={logout}>Log Out</button>
          </div>
      
        </>
        
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;