import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import {
  loadCart,
  deleteFromCart,
  increaseCartItem,
  decreaseCarItem,
} from "../actions/carAction";
import {
  getAllGrouItem,
  createGroupSuccess,
  preloadCheck,
  clearInfoWhenLogout,
} from "../actions/groupOrderAction";
import cartService from "../services/cartService";
import groupOrderService from "../services/groupOrderService";
import { toast } from "react-toastify";
import io from "socket.io-client";
import ProductInCard from "./productInCard";

const socket = io(window.location.origin);
// const socket = io(process.env.REACT_APP_IO_PORT);

socket.on("connect", () => {
  console.log(`Client connected socketID ${socket.id}`);
});

const { getAllCartItem, removeFromCart, addToCart, decreaseOne } = cartService;
const {
  getAllItemInGroup,
  createGroup,
  preCheck,
  leaveTheGroup,
  deleteThisGroup,
  toggleGroupStatus,
} = groupOrderService;

function Cart({
  open,
  closeDialog,
  cart,
  loadData,
  account,
  removeItem,
  increaseItem,
  decreaseItem,
  groupOrderReducer,
  loadItemFromGroup,
  createGroupOrder,
  checkGroupJoined,
  leaveGroupOrder,
  deleteGroupOrder,
  toggleGroupOrderStatus,
  clearInfo,
}) {
  //show the invite link
  const [toggle, setToggle] = useState(false);
  const { token, _id } = account;
  const {
    isOwner,
    groupId,
    chatroomId,
    data: groupCart,
    isOrderLocker,
  } = groupOrderReducer;

  const navigate = useNavigate();


  socket.on("force-update", (data) => {
    loadItemFromGroup(data);
  });

  socket.on("force-user-leave", (data) => {
    clearInfo();
    leaveGroupOrder(data);
  });

  socket.on("locked", (data) => {
    toggleGroupOrderStatus({ ...data });
  });
  socket.on("paid", () => {
    clearInfo();
  });

  useEffect(() => {
    const loadItem = async () => {
      if (groupId === "" || groupId === null) {
        const response = await getAllCartItem(token);
        if (response?.status === 200) {
          loadData(response?.message?.orderItems);
        }
      } else {
        const checkResponse = await preCheck(token);
        if (checkResponse?.status === 200) {
          const { data } = checkResponse;
          checkGroupJoined(data);
        }
        const response = await getAllItemInGroup(groupId, token);
        if (response?.status === 200) {
          loadItemFromGroup(response?.data);
        }
      }
    };
    loadItem();
  }, [groupId, loadData, token, checkGroupJoined, loadItemFromGroup]);

  const handleDelete = async (item) => {
    if (groupId !== "" && isOrderLocker === true) {
      toast.info("Your group are locked");
      return;
    }
    const response = await removeFromCart(item._id, token);
    if (response.status === 200) {
      if (groupId === "") {
        removeItem(item);
      } else {
        socket.emit("group-changed", groupId);
      }
    }
  };

  const handleIncreaseOne = async (item) => {
    if (groupId !== "" && isOrderLocker === true) {
      toast.info("Your group are locked");
      return;
    }
    if (item.orderQuantity >= 5) {
      toast.error("The maximun quantity of a product is 5");
      return;
    } else {
      const response = await addToCart(
        { itemId: item.itemId, quantity: 1, orderId: groupId || null },
        token
      );
      if (response.status === 201) {
        if (groupId === "") {
          increaseItem(item);
        } else {
          socket.emit("group-changed", groupId);
        }
      }
    }
  };

  const handleDecreaseOne = async (item) => {
    if (groupId !== "" && isOrderLocker === true) {
      toast.info("Your group are locked");
      return;
    }
    if (item.orderQuantity === 1) {
      await handleDelete(item);
      socket.emit("group-changed", groupId);
      return;
    } else {
      const response = await decreaseOne(item._id, token);
      if (response?.status === 200) {
        if (groupId === "") {
          decreaseItem(item);
        } else {
          socket.emit("group-changed", groupId);
        }
      }
    }
  };

  const handleLeaveGroup = async () => {
    const response = await leaveTheGroup(token);
    if (response?.status === 200) {
      const { data } = response;
      leaveGroupOrder(data);
      clearInfo();
      socket.emit("group-changed", groupId);
      socket.disconnect();
      toast.success("You had leaved the group Order");
    }
  };

  const handleDeleteGroupOrder = async () => {
    const response = await deleteThisGroup(groupId, token);
    clearInfo();
    if (response?.status === 200) {
      const { data } = response;
      deleteGroupOrder(data);
      socket.emit("group-deleted");
    }
  };

  const handleCreateGroupOrder = async () => {
    const response = await createGroup(token);
    if (response.status === 201) {
      const { message } = response;
      createGroupOrder({
        groupId: message.groupId,
        isOwner: message.isOwner,
        chatroomId: message.chatroomId
      });
    }
  };

  const coutTotalInGroupOrder = (data) => {
    let concatArrayItem = [];
    data.map((item) => concatArrayItem.push(...item.data));
    return concatArrayItem.reduce((init, item) => init + item.orderPrice, 0);
  };

  const handleToggle = () => {
    setToggle(!toggle);
  };
  const lockTheGroup = async () => {
    const response = await toggleGroupStatus(groupId, true, token);
    if (response?.status === 200) {
      toggleGroupOrderStatus({ isOrderLocker: true });
      socket.emit("group-locked-toggle", { isOrderLocker: true });
      closeDialog();
      navigate("/checkout");
    }
  };

  const handleUnlockedGroup = async () => {
    const response = await toggleGroupStatus(groupId, false, token);
    if (response?.status === 200) {
      toggleGroupOrderStatus({ isOrderLocker: false });
      socket.emit("group-locked-toggle", { isOrderLocker: false });
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-hidden z-50"
        onClose={closeDialog}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        <div className="flex content-center">
                          <h2>Shopping Car</h2>
                          {isOrderLocker ? (
                            <span className="ml-2 rounded-md text-xs bg-red-200 p-2">
                              Locked
                            </span>
                          ) : (
                            <span className="ml-2 rounded-md text-xs bg-green-200 p-2">
                              Available
                            </span>
                          )}
                        </div>
                      </Dialog.Title>

                      <div className="ml-3 h-7 flex items-center mt-4">
                        <button
                          type="button"
                          className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                          onClick={closeDialog}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="max-w-md flex">
                      {groupId === "" ? (
                        <button
                          onClick={handleCreateGroupOrder}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-8"
                        >
                          Create Group Order
                        </button>
                      ) : isOwner === true ? (
                        <div>
                          <div className="flex">
                            <button
                              onClick={handleToggle}
                              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-8"
                            >
                              Invite
                            </button>
                            <Link
                              to={`/chatroom/${chatroomId}`}
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-8"
                            >
                              Chat
                            </Link>
                            <button
                              onClick={handleDeleteGroupOrder}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-8"
                            >
                              Delete This Group
                            </button>
                          </div>
                          <div
                            className="max-w-md"
                            style={{
                              display: toggle ? "block" : "none",
                            }}
                          >
                            <p className="leading-relaxed">
                              {window.location.origin.toString() +
                                `/share/${groupId}/${chatroomId}`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={handleLeaveGroup}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Leave
                          </button>
                          <Link
                            to={`/chatroom/${chatroomId}`}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-8"
                          >
                            Chat
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        <ul className="-my-6 divide-y divide-gray-200">
                          {groupId === ""
                            ? cart.map((product) => (
                                <ProductInCard
                                  key={product._id}
                                  product={product}
                                  handleDecreaseOne={handleDecreaseOne}
                                  handleIncreaseOne={handleIncreaseOne}
                                  handleDelete={handleDelete}
                                />
                              ))
                            : groupCart.map((eachUserInCart, index) => {
                                const { fullName, data, currentUserId } =
                                  eachUserInCart;
                                return (
                                  <>
                                    <div
                                      key={index}
                                      className={`flex justify-between text-base font-medium text-gray-${
                                        currentUserId === _id ? 900 : 400
                                      } mt-4`}
                                    >
                                      <h5>
                                        {fullName}{" "}
                                        {currentUserId === _id && "(You)"}
                                      </h5>
                                    </div>
                                    {data.map((item) => (
                                      <ProductInCard
                                        key={item._id}
                                        currentUserId={currentUserId}
                                        accountId={_id}
                                        product={item}
                                        handleDecreaseOne={handleDecreaseOne}
                                        handleIncreaseOne={handleIncreaseOne}
                                        handleDelete={handleDelete}
                                      />
                                    ))}
                                  </>
                                );
                              })}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>
                        $
                        {groupId === ""
                          ? cart.length !== 0 &&
                            cart.reduce((sum, item) => sum + item.orderPrice, 0)
                          : coutTotalInGroupOrder(groupCart)}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    {groupId === "" ? (
                      <div className="mt-6">
                        <Link
                          onClick={closeDialog}
                          to={
                            groupId === ""
                              ? cart.length === 0
                                ? "#"
                                : "/checkout"
                              : groupCart.length === 0
                              ? "#"
                              : "/checkout"
                          }
                          className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Checkout
                        </Link>
                      </div>
                    ) : (
                      isOwner && (
                        <div className="flex justify-around mt-6">
                          <button
                            onClick={lockTheGroup}
                            className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Checkout
                          </button>
                          {isOrderLocker && (
                            <button
                              onClick={handleUnlockedGroup}
                              className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                              Unlock Group
                            </button>
                          )}
                        </div>
                      )
                    )}
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                      <p>
                        or{" "}
                        <button
                          type="button"
                          className="text-indigo-600 font-medium hover:text-indigo-500"
                          onClick={closeDialog}
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const mapStateToProps = (state) => {
  return {
    cart: state.cartReducer,
    account: state.authenticateReducer.account,
    groupOrderReducer: state.groupOrderReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearInfo: () => dispatch(clearInfoWhenLogout()),
    loadData: (data) => dispatch(loadCart(data)),
    removeItem: (item) => dispatch(deleteFromCart(item)),
    increaseItem: (item) => dispatch(increaseCartItem(item)),
    decreaseItem: (item) => dispatch(decreaseCarItem(item)),
    loadItemFromGroup: (data) => dispatch(getAllGrouItem(data)),
    createGroupOrder: (data) => dispatch(createGroupSuccess(data)),
    checkGroupJoined: (data) => dispatch(preloadCheck(data)),
    leaveGroupOrder: (data) => dispatch(preloadCheck(data)),
    deleteGroupOrder: (data) => dispatch(preloadCheck(data)),
    toggleGroupOrderStatus: (data) => dispatch(preloadCheck(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
