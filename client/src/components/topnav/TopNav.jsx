import React from "react";

import "./topnav.css";

import { logout } from "../../actions/authenticateAction";

import Dropdown from "../dropdown/Dropdown";

import ThemeMenu from "../thememenu/ThemeMenu";

import { connect } from "react-redux";

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img
        src={
          user.image ||
          "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg"
        }
        alt=""
      />
    </div>
    <div className="topnav__right-user__name">{user.fullname}</div>
  </div>
);

const renderUserMenu = (item, index, doLogout) => (
  <button onClick={doLogout} key={index}>
    <div className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </button>
);

const Topnav = ({ authenticateReducer, doLogout }) => {
  const { account } = authenticateReducer;
  const user_menu = [
    {
      icon: "bx bx-log-out-circle bx-rotate-180",
      content: "Logout",
    },
  ];
  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(account)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index, doLogout)}
          />
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

const mapStateToProp = (state) => {
  const { authenticateReducer } = state;
  return {
    authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doLogout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProp, mapDispatchToProps)(Topnav);
