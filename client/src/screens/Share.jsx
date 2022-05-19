import React, { Fragment, useEffect, useRef, useState } from "react";
import { loginSuccess } from "../actions/authenticateAction";
import { connect } from "react-redux";
import authenticateService from "../services/authenticateService";
import { toast } from "react-toastify";
import groupOrderService from "../services/groupOrderService";
import { preloadCheck } from "../actions/groupOrderAction";
import { Dialog, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/outline";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(window.location.origin);

const { login } = authenticateService;
const { joinTheGroupOrder, checkJoinedGroup } = groupOrderService;

const ShareLink = ({
  putDataToAuthReducer,
  preCheckGroupOrder,
  authenticateReducer,
}) => {
  const [open] = useState(true);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const { slug, chatroomId } = useParams();

  const { account, isAuthenticated } = authenticateReducer;

  useEffect(() => {
    const checkAuthAndJoin = async () => {
      if (isAuthenticated) {
        const join = await joinTheGroupOrder(slug, chatroomId, account.token);
        if (join.status === 200) {
          const joinedSuccess = await checkJoinedGroup(account.token);
          const { data } = joinedSuccess;
          preCheckGroupOrder(data);
          socket.emit("group-changed", slug);
          toast.success("Join the group success");
          navigate("/");
        }
      }
    };
    checkAuthAndJoin();
  }, [account.token, isAuthenticated, navigate, preCheckGroupOrder, slug, chatroomId]);

  const cancelButtonRef = useRef(null);

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
        };
        const join = await joinTheGroupOrder(slug,chatroomId, response.data.token);
        if (join.status === 200) {
          const joinedSuccess = await checkJoinedGroup(response.data.token);
          const { data } = joinedSuccess;
          preCheckGroupOrder(data);
          putDataToAuthReducer(payload);
          socket.emit("group-changed", slug);
          navigate("/");
          toast.success("Login Success");
        }
      }
    } catch (error) {
      return toast.error("Login Failed");
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={() => navigate("/")}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Login
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please Login to continue
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <div className="mt-3 w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <form class="flex flex-col pt-2 md:pt-2">
                    <div class="flex flex-col pt-4">
                      <label htmlFor="email" class="text-lg">
                        Email
                      </label>
                      <input
                        type="text"
                        id="username"
                        onChange={handleChange}
                        placeholder="username"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div class="flex flex-col pt-4">
                      <label htmlFor="password" class="text-lg">
                        Password
                      </label>
                      <input
                        type="password"
                        onChange={handleChange}
                        id="password"
                        placeholder="Password"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <input
                      onClick={handleSubmit}
                      type="submit"
                      value="Log In"
                      class="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
                    />
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putDataToAuthReducer: (payload) => dispatch(loginSuccess(payload)),
    preCheckGroupOrder: (data) => dispatch(preloadCheck(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareLink);
