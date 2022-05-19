import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authenticateService from "../services/authenticateService";

const { register } = authenticateService;

const RegisterScreen = () => {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPwd: "",
    fullname: "",
  });

  const navigation = useNavigate();

  const handleTextChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPwd } = registerForm;
    if (password !== confirmPwd) {
      toast.warning("password doesnt match");
    } else {
      const response = await register(registerForm);
      if (response.status === 400) {
        toast.error("account already existed");
      } else {
        toast.success("register success");
        navigation("/login");
      }
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
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="username"
                value={registerForm.username}
                onChange={handleTextChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex flex-col pt-4">
              <label htmlFor="name" className="text-lg">
                Full Name
              </label>
              <input
                type="name"
                id="fullname"
                placeholder="Name"
                value={registerForm.fullname}
                onChange={handleTextChange}
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
                placeholder="Password"
                value={registerForm.password}
                onChange={handleTextChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex flex-col pt-4">
              <label htmlFor="password" className="text-lg">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPwd"
                placeholder="Password"
                value={registerForm.confirmPwd}
                onChange={handleTextChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <input
              type="submit"
              value="Sign Up"
              onClick={handleSubmit}
              className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
            />
          </form>
          <div className="text-center pt-12 pb-12">
            <p>
              Have an account?
              <NavLink
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
      </div>

      <div className="w-1/2 shadow-2xl">
        <img 
          alt="sneakers"
          className="object-cover w-full h-screen hidden md:block"
          src="https://tuoitredoisong.net/wp-content/uploads/2019/10/giay-sneaker-la-gi-2-700x700.jpg"
        />
      </div>
    </div>
  );
};

export default RegisterScreen;
