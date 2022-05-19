import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import "./layout.css";

import Sidebar from "../../components/sidebar/Sidebar";
import TopNav from "../../components/topnav/TopNav";

import { getTheme, setColor, setMode } from "../../actions/themeAction";
import { connect } from "react-redux";

const AdminLayout = ({ children, themeReducer, authenticateReducer }) => {
  const { account } = authenticateReducer;
  const navigate = useNavigate();
  useEffect(() => {
    if (account.role !== "ADMIN") {
      navigate("/product");
    }
  }, [account.role, navigate]);

  return (
    <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
      <Sidebar />
      <div className="layout__content">
        <TopNav />
        <div className="layout__content-main">{children}</div>
      </div>
    </div>
  );
};

const mapStateToProp = (state) => {
  const { themeReducer, authenticateReducer } = state;
  return {
    themeReducer,
    authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCurrentTheme: () => dispatch(getTheme()),
    setAppColor: (color) => dispatch(setColor(color)),
    setAppTheme: (theme) => dispatch(setMode(theme)),
  };
};

export default connect(mapStateToProp, mapDispatchToProps)(AdminLayout);
