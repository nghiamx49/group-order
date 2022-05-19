import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { loginSuccess } from "../actions/authenticateAction";
import { connect } from "react-redux";
import authenticateService from "../services/authenticateService";
import { toast } from "react-toastify";
import groupOrderService from "../services/groupOrderService";
import { preloadCheck } from "../actions/groupOrderAction";

const { login } = authenticateService;
const { preCheck } = groupOrderService;

const LoginScreen = ({ putDataToAuthReducer, preCheckGroupOrder }) => {
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { username, password } = loginForm;
      const response = await login({ username, password });
      if (response.status === 200) {
        const payload = {
          isAuthenticated: response.isAuthenticated,
          account: { ...response.data },
          token: response.data.token,
        };
        const checkGroupOrder = await preCheck(response.data.token);
        const { data } = checkGroupOrder;
        preCheckGroupOrder(data);
        putDataToAuthReducer(payload);
        toast.success("Login Success");
      }
    } catch (error) {
      return toast.error("Login Failed");
    }
  };

  return (
    <div className="w-full flex flex-wrap">
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
          <a href="http://localhost:3000/" className="bg-black text-white font-bold text-xl p-4">
            Logo
          </a>
        </div>

        <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
          <p className="text-center text-3xl">Welcome.</p>
          <form className="flex flex-col pt-3 md:pt-8">
            <div className="flex flex-col pt-4">
              <label htmlFor="email" className="text-lg">
                UserName
              </label>
              <input
                type="text"
                id="username"
                placeholder="your@email.com"
                value={loginForm.username}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex flex-col pt-4">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={handleChange}
                placeholder="Password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <input
              type="submit"
              value="Log In"
              onClick={handleSubmit}
              className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
            />
          </form>
          <div className="text-center pt-12 pb-12">
            <p>
              Don't have an account?
              <NavLink
                to="/register"
                className="text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Register Here
              </NavLink>
            </p>
          </div>
        </div>
      </div>

      <div className="w-1/2 shadow-2xl">
        <img
          alt="sneaker"
          className="object-cover w-full h-screen hidden md:block"
          src="https://product.hstatic.net/1000375725/product/1024_f3c3e85b900749e9a03e95ae02e8e99b_master.jpg"
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    putDataToAuthReducer: (payload) => dispatch(loginSuccess(payload)),
    preCheckGroupOrder: (data) => dispatch(preloadCheck(data)),
  };
};

export default connect(null, mapDispatchToProps)(LoginScreen);
