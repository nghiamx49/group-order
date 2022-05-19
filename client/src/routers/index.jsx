import {
  Navigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { connect } from "react-redux";
import Layout from "../layout/AuthorizeLayout";
import CheckoutScreen from "../screens/CheckoutScreen";
import LandingPage from "../screens/LandingPage";
import LoginScreen from "../screens/LoginScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import ProductScreen from "../screens/ProductScreen";
import NotFoundScreen from "../screens/404Screen";
import Share from "../screens/Share";
import Dashboard from "../screens/Dashboard";
import Products from "../screens/Products";
import Customers from "../screens/Customers";
import AdminLayout from "../layout/adminLayout/Layout";
import ImportPage from "../screens/Import";
import Orders from "../screens/Order";
import ChatRoom from "../screens/ChatScreen";

const AppRouting = ({ authenticateReducer }) => {
  const { isAuthenticated } = authenticateReducer;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/product"
          element={
            <Layout>
              <ProductScreen />
            </Layout>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <Layout>
              <ProductDetailScreen />
            </Layout>
          }
        />
        <Route
          path="/product-detail/:slug"
          element={
            <AdminLayout>
              <ProductDetailScreen />
            </AdminLayout>
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Layout>
                <LoginScreen />
              </Layout>
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <Layout>
                <RegisterScreen />
              </Layout>
            )
          }
        />
        <Route
          path="/checkout"
          element={
            isAuthenticated ? (
              <Layout>
                <CheckoutScreen />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Layout>
                <UserProfileScreen />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/share/:slug/:chatroomId"
          element={
            <Layout>
              <Share />
            </Layout>
          }
        />
        <Route
          path="/404_notfound"
          element={
            <Layout>
              <NotFoundScreen />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/import"
          element={
            isAuthenticated ? (
              <AdminLayout>
                <ImportPage />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chatroom/:roomId"
          element={
            isAuthenticated ? (
              <Layout>
                <ChatRoom />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/customers"
          element={
            isAuthenticated ? (
              <AdminLayout>
                <Customers />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/all-products"
          element={
            isAuthenticated ? (
              <AdminLayout>
                <Products />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/all-orders"
          element={
            isAuthenticated ? (
              <AdminLayout>
                <Orders />
              </AdminLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <NotFoundScreen />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

const mapStateToProp = (state) => {
  const { authenticateReducer } = state;
  return { authenticateReducer };
};

export default connect(mapStateToProp)(AppRouting);
