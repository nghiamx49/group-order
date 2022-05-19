import React, { useEffect } from "react";
import NavigationBar from "../components/Navigation";
import Footer from "../components/Footer";
import { connect } from "react-redux";
import { logout } from "../actions/authenticateAction";
import { clearInfoWhenLogout } from "../actions/groupOrderAction";
import { parseJwt } from "../ultis/jwt";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const AuthorizeLayout = ({
  children,
  authenticateReducer,
  logout,
  clearInfo,
}) => {
  const { isAuthenticated, account } = authenticateReducer;
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = () => {
      if (isAuthenticated) {
        if (account.role === "ADMIN") {
          navigate("/dashboard");
        }
        const result = parseJwt(account.token);
        const { exp } = result;
        if (exp < Date.now() / 1000) {
          logout();
          clearInfo();
          toast.info("Your session had been expired");
        }
      }
    };
    verifyToken();
  }, [account.role, account.token, clearInfo, isAuthenticated, logout, navigate]);
  return (
    <>
      <NavigationBar
        isAuthenticated={isAuthenticated}
        logout={logout}
        clearInfo={clearInfo}
      />
      {children}
      {/* <Pagination /> */}
      <Footer />
    </>
  );
};

const mapStateToProp = (state) => {
  const { authenticateReducer } = state;
  return { authenticateReducer };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    clearInfo: () => dispatch(clearInfoWhenLogout()),
  };
};

export default connect(mapStateToProp, mapDispatchToProps)(AuthorizeLayout);
