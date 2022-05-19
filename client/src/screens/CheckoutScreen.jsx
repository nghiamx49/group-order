import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import { toast } from "react-toastify";
import { clearInfoWhenLogout } from "../actions/groupOrderAction";
import checkoutService from "../services/checkoutService";
import io from "socket.io-client";
const socket = io(window.location.origin);

const { groupCheckout, sendMail } = checkoutService;

const CheckoutScreen = ({
  cart,
  groupOrderReducer,
  authenticateReducer,
  clearInfo,
}) => {
  const [step, setStep] = useState(1);
  const { isOwner, groupId, data: groupCart } = groupOrderReducer;

  const { account } = authenticateReducer;

  const coutTotalInGroupOrder = () => {
    let concatArrayItem = [];
    groupCart.map((item) => concatArrayItem.push(...item.data));
    return concatArrayItem.reduce((init, item) => init + item.orderPrice, 0);
  };

  const countTotalInCart = cart.reduce((sum, item) => sum + item.orderPrice, 0);

  const [submitInfor, setSubmitInfor] = useState({
    orderId: groupId,
    deliveryPrice: groupId === "" ? countTotalInCart : coutTotalInGroupOrder(),
    address: "",
    description: `Paid for bill: ${groupId}`,
    email: "",
  });

  const navigate = useNavigate();

  const handleTextChange = (e) => {
    setSubmitInfor({ ...submitInfor, [e.target.id]: e.target.value });
  };

  socket.on("paid", () => {
    clearInfo();
  });

  useEffect(() => {
    if (groupId !== "" && !isOwner) {
      navigate("/404_notfound");
    }
  }, [groupId, isOwner, navigate]);

  const handlePaymentSuccess = async () => {
    const checkoutResponse = await groupCheckout(
      submitInfor,
      groupId,
      account.token
    );
    if (checkoutResponse?.status === 201) {
      const { email, orderId, description } = submitInfor;
      const mailResponse = await sendMail(
        { email: email, orderId: orderId, message: description },
        account.token
      );
      setStep(3);
      if (mailResponse?.status === 200) {
        clearInfo();
        socket.emit("group-paid");
        setSubmitInfor({
          orderId: groupId,
          deliveryPrice: 0,
          address: "",
          description: `Paid for bill: ${groupId}`,
          email: "",
        });
      }
    }
  };
  return (
    <main className="my-8">
      <div className="container mx-auto px-6">
        <h3 className="text-gray-700 text-2xl font-medium">Checkout</h3>
        <div className="flex flex-col lg:flex-row mt-8">
          <div className="w-full lg:w-1/2 order-2">
            <div className="flex items-center">
              <button
                className={`flex text-sm ${
                  step === 1 ? "text-blue-500" : "text-gray-500"
                } focus:outline-none`}
              >
                <span
                  className={`flex items-center justify-center ${
                    step === 1
                      ? "text-white bg-blue-500 rounded-full"
                      : "border-2 border-blue-500 rounded-full"
                  } h-5 w-5 mr-2`}
                >
                  1
                </span>{" "}
                Contacts
              </button>
              <button
                className={`flex text-sm ${
                  step === 2 ? "text-blue-500" : "text-gray-500"
                } ml-8 focus:outline-none`}
              >
                <span
                  className={`flex items-center justify-center ${
                    step === 2
                      ? "text-white bg-blue-500 rounded-full"
                      : "border-2 border-blue-500 rounded-full"
                  } h-5 w-5 mr-2`}
                >
                  2
                </span>{" "}
                Payments
              </button>
              <button
                className={`flex text-sm ${
                  step === 3 ? "text-blue-500" : "text-gray-500"
                } ml-8 focus:outline-none`}
                disabled
              >
                <span
                  className={`flex items-center justify-center ${
                    step === 3
                      ? "text-white bg-blue-500 rounded-full"
                      : "border-2 border-blue-500 rounded-full"
                  } h-5 w-5 mr-2`}
                >
                  3
                </span>{" "}
                Success
              </button>
            </div>
            <form className="mt-8 lg:w-3/4">
              {step === 1 ? (
                <div className="mt-8">
                  <h4 className="text-sm text-gray-500 font-medium">
                    Delivery Information
                  </h4>
                  <div className="mt-6 flex">
                    <label className="block flex-1 ml-3">
                      <input
                        type="email"
                        className="form-input mt-1 block w-full text-gray-700"
                        placeholder="Email"
                        id="email"
                        value={submitInfor.email}
                        onChange={handleTextChange}
                      />
                    </label>
                  </div>
                  <div className="mt-6 flex">
                    <label className="block flex-1 ml-3">
                      <input
                        type="text"
                        className="form-input mt-1 block w-full text-gray-700"
                        placeholder="Address"
                        value={submitInfor.address}
                        id="address"
                        onChange={handleTextChange}
                      />
                    </label>
                  </div>
                </div>
              ) : step === 2 ? (
                <PayPalButton
                  options={{
                    clientId:
                      "ARbhyQWg2RhV7E9dJc5yej1rHV86mPm5dYATwxbkNjwyzqcuMoGPEwAOyBX1pONEQ1_mD7Y7L0P3qcHD",
                    currency: "USD",
                  }}
                  style={{ position: "static" }}
                  amount={submitInfor.deliveryPrice}
                  onSuccess={(details, data) => handlePaymentSuccess()}
                />
              ) : (
                step === 3 && (
                  <div class="relative flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-md py-5 pl-6 pr-8 sm:pr-6">
                    <div class="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-4 sm:pb-0">
                      <div class="text-green-500">
                        <svg
                          class="w-6 sm:w-5 h-6 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <div class="text-sm font-medium ml-3">
                        Success Payment.
                      </div>
                    </div>
                    <div class="text-sm tracking-wide text-gray-500 mt-4 sm:mt-0 sm:ml-4">
                      Your Payment was Successful. You can use our{" "}
                      <Link to="/product" className="underline text-blue-500">
                        services!
                      </Link>
                    </div>
                    <div class="absolute sm:relative sm:top-auto sm:right-auto ml-auto right-4 top-4 text-gray-400 hover:text-gray-800 cursor-pointer">
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </div>
                  </div>
                )
              )}
              <div className="flex items-center justify-between mt-8">
                <button
                  className="flex items-center text-gray-700 text-sm font-medium rounded hover:underline focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep(step - 1);
                  }}
                  style={{ display: step !== 2 ? "none" : "flex" }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
                  </svg>
                  <span className="mx-2">Back step</span>
                </button>
                <button
                  className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      step === 1 &&
                      (submitInfor.email === "" || submitInfor.address === "")
                    ) {
                      toast.error(
                        "you must entered both address and email before go to next step"
                      );
                      return;
                    }
                    setStep(step + 1);
                  }}
                  style={{ display: step !== 1 ? "none" : "flex" }}
                >
                  <span>Next Step</span>
                  <svg
                    className="h-5 w-5 mx-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>
          <div className="w-full mb-8 flex-shrink-0 order-1 lg:w-1/2 lg:mb-0 lg:order-2">
            <div className="flex justify-center lg:justify-end">
              <div className="border rounded-md max-w-md w-full px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-700 font-medium">Order total</h3>
                  <span className="text-gray-600 text-sm">
                    ${submitInfor.deliveryPrice}
                  </span>
                </div>
                {groupId === ""
                  ? cart.map((item) => (
                      <div className="flex justify-between mt-6">
                        <div className="flex">
                          <img
                            className="h-20 w-20 object-cover rounded"
                            src={item.itemImage}
                            alt=""
                          />
                          <div className="mx-3">
                            <h3 className="text-sm text-gray-600">
                              {item.itemName}
                            </h3>
                          </div>
                        </div>
                        <span className="text-gray-600">
                          ${item.orderPrice}
                        </span>
                      </div>
                    ))
                  : groupCart.map((eachUserInCart) => {
                      const { fullName, data } = eachUserInCart;
                      return (
                        <>
                          <div
                            className={`flex justify-between text-base font-medium text-gray-900 mt-4`}
                          >
                            <h5>User Name: {fullName} </h5>
                          </div>
                          {data.map((item) => (
                            <div className="flex justify-between mt-6">
                              <div className="flex">
                                <img
                                  className="h-20 w-20 object-cover rounded"
                                  src={item.itemImage}
                                  alt=""
                                />
                                <div className="mx-3">
                                  <h3 className="text-sm text-gray-600">
                                    {item.itemName}
                                  </h3>
                                </div>
                              </div>
                              <span className="text-gray-600">
                                {item.orderPrice}
                              </span>
                            </div>
                          ))}
                        </>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const mapStateToProps = (state) => {
  const { authenticateReducer } = state;
  return {
    cart: state.cartReducer,
    groupOrderReducer: state.groupOrderReducer,
    authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearInfo: () => dispatch(clearInfoWhenLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);
