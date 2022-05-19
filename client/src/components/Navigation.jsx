import React, { useState, Fragment } from "react";
import { ShoppingBagIcon } from "@heroicons/react/outline";
import { Menu, Transition } from "@headlessui/react";
import logo from "../assets/images/logo.png";
import VietNamFlag from "../assets/images/vietnam.png";
import Cart from "../components/Cart";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navigation({
  isAuthenticated,
  logout,
  cart,
  clearInfo,
  groupOrderReducer,
}) {
  const {
    groupId,
    data: groupCart,
  } = groupOrderReducer;

  const coutTotalInGroupOrder = (data) => {
    let concatArrayItem = [];
    data.map((item) => concatArrayItem.push(...item.data));
    return concatArrayItem.reduce((init, item) => init + item.orderQuantity, 0);
  };

  const [cartToggle, setCartToggle] = useState(false);
  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="h-16 flex items-center">
              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <NavLink to="/">
                  <span className="sr-only">PShop</span>
                  <img className="h-8 w-auto" src={logo} alt="" />
                </NavLink>
              </div>

              <div className="flex lg:ml-6">
                <NavLink
                  to="/product"
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Products
                </NavLink>
              </div>
              {/* <div className="flex lg:ml-6">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Sign in
                </NavLink>
              </div>
              <div className="flex lg:ml-6">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Sign in
                </NavLink>
              </div>
              <div className="flex lg:ml-6">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Sign in
                </NavLink>
              </div>
              <div className="flex lg:ml-6">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Sign in
                </NavLink>
              </div> */}

              <div className="ml-auto flex items-center">
                {isAuthenticated ? (
                  <Menu as="div" className="ml-3 relative z-40">
                    <div>
                      <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://hhppaper.com/anh_co_dong/default-image.png"
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <NavLink
                              to="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </NavLink>
                          )}
                        </Menu.Item>
                        {/* <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item> */}
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={(e) => {
                                e.preventDefault();
                                clearInfo();
                                logout();
                              }}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <>
                    <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                      <NavLink
                        to="/login"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign in
                      </NavLink>
                      <span
                        className="h-6 w-px bg-gray-200"
                        aria-hidden="true"
                      />
                      <NavLink
                        to="/register"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        Sign up
                      </NavLink>
                    </div>

                    <div className="hidden lg:ml-8 lg:flex">
                      <a
                        href="http://localhost:3000/"
                        className="text-gray-700 hover:text-gray-800 flex items-center"
                      >
                        <img
                          src={VietNamFlag}
                          alt=""
                          className="w-5 h-auto block flex-shrink-0"
                        />
                        <span className="ml-3 block text-sm font-medium">
                          VN
                        </span>
                        <span className="sr-only">, change currency</span>
                      </a>
                    </div>
                  </>
                )}

                {/* Cart */}
                {isAuthenticated && (
                  <div className="ml-4 flow-root lg:ml-6">
                    <div
                      className="group -m-2 p-2 flex items-center"
                      onClick={() => setCartToggle(true)}
                    >
                      <ShoppingBagIcon
                        className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                        {groupId === ""
                          ? cart.reduce(
                              (initVal, item) =>
                                (initVal += item.orderQuantity),
                              0
                            )
                          : coutTotalInGroupOrder(groupCart)}
                      </span>
                      <span className="sr-only">items in cart, view bag</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Cart open={cartToggle} closeDialog={() => setCartToggle(false)} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    cart: state.cartReducer,
    groupOrderReducer: state.groupOrderReducer,
  };
};

export default connect(mapStateToProps)(Navigation);
