import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../components/table/Table";
import { Dialog, Transition } from "@headlessui/react";

const CustomModal = ({ toggle, handleToggle, setIsLoading }) => {
  const [trademark, setTrademark] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    itemTrademarkId: "",
    itemQuantity: 1,
    itemImage: "",
    itemPrice: 0,
    itemDescription: "",
    itemCategory: "",
  });

  const cloudinaryUrl = "https://api.cloudinary.com/v1_1/huynbt/image/upload";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    const getTrademark = async () => {
      const request = await fetch(`${process.env.REACT_APP_API}/trademark`);
      const response = await request.json();
      const { trademarks } = response.message;
      setTrademark(trademarks);
      setFormData({
        ...formData,
        itemTrademarkId: trademarks[0].trademarkName,
      });
    };
    getTrademark();
  }, []);

  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("upload_preset", "product_image");

    const response = await fetch(cloudinaryUrl, {
      method: "post",
      body: formData,
    });
    const data = await response.json();
    setFormData((prev) => ({ ...prev, itemImage: data.secure_url }));
  };

  const handleCreateProduct = async () => {
    const request = await fetch(`${process.env.REACT_APP_API}/item/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    });
    const response = await request.json();
    if (response.status === 400) {
      toast.error(`${response.message.mesBody}`);
    }
    if (response.status === 201) {
      toast.success("Product Created");
      setFormData({
        itemName: "",
        itemTrademarkId: "",
        itemQuantity: 1,
        itemImage: "",
        itemPrice: 0,
        itemDescription: "",
        itemCategory: "",
      });
      setIsLoading(true);
      handleToggle();
    }
  };

  return (
    <Transition.Root show={toggle} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={handleToggle}
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
              <div className="bg-white px-4 pt-5 pb-4 sm:pb-4">
                <div className="sm:block">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Create Product
                    </Dialog.Title>
                    <div className="mt-2">
                      <form>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="itemName"
                          >
                            Product Name
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="itemName"
                            type="text"
                            value={formData.itemName}
                            onChange={handleChange}
                            placeholder="Product Name"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="itemTrademarkId"
                          >
                            Product Trademark
                          </label>
                          <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="itemTrademarkId"
                            onChange={handleChange}
                            type="text"
                            value={formData.itemTrademarkId}
                          >
                            {trademark.map((item, index) => (
                              <option key={index}>{item.trademarkName}</option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="itemQuantity"
                          >
                            Product Quantity
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="itemQuantity"
                            type="text"
                            onChange={handleChange}
                            value={formData.itemQuantity}
                            placeholder="Product Quantity"
                          />
                        </div>
                        <div className="mb-4">
                          {formData.itemImage ? (
                            <div className="flex justify-center mt-8">
                              <div className="rounded-lg shadow-xl bg-gray-50 lg:w-1/2">
                                <div className="m-4">
                                  <div className="flex items-center justify-center w-full">
                                    <img src={formData.itemImage} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center mt-8">
                              <div className="rounded-lg shadow-xl bg-gray-50 lg:w-1/2">
                                <div className="m-4">
                                  <label className="inline-block mb-2 text-gray-500">
                                    Upload Image(jpg,png,svg,jpeg)
                                  </label>
                                  <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                      <div className="flex flex-col items-center justify-center pt-7">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-12 h-12 text-gray-400 group-hover:text-gray-600"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fill-rule="evenodd"
                                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                            clip-rule="evenodd"
                                          />
                                        </svg>
                                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                          Select a photo
                                        </p>
                                      </div>
                                      <input
                                        type="file"
                                        onChange={uploadFile}
                                        className="opacity-0"
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="itemPrice"
                          >
                            Product Price
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="itemPrice"
                            type="text"
                            onChange={handleChange}
                            value={formData.itemPrice}
                            placeholder="Product Price"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="itemCategory"
                          >
                            Product Category
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="itemCategory"
                            type="text"
                            onChange={handleChange}
                            value={formData.itemCategory}
                            placeholder="Product Category"
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="itemDescription"
                          >
                            Product Description
                          </label>
                          <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="itemDescription"
                            type="text"
                            onChange={handleChange}
                            value={formData.itemDescription}
                            placeholder="Product Description"
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCreateProduct}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleToggle}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const Products = () => {
  const [data, setData] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const getData = async () => {
    try {
      const request = await fetch(
        `${process.env.REACT_APP_API}/admin/allproducts`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const response = await request.json();
      setData(response.message.items);
      setIsLoading(false);
      console.log(isLoading);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, [toggle]);
  const customerTableHead = [
    "Id",
    "Item Name",
    "Trademark",
    "Category",
    "Price",
    "Rating",
    "Quantity",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>
        {" "}
        <Link key={index} to={`/product-detail/${item._id}`}>
          {item._id}
        </Link>
      </td>
      <td>
        {" "}
        <Link key={index} to={`/product-detail/${item._id}`}>
          {item.itemName}
        </Link>
      </td>
      <td>
        {" "}
        <Link key={index} to={`/product-detail/${item._id}`}>
          {item.trademarkName}
        </Link>
      </td>
      <td>
        {" "}
        <Link key={index} to={`/product-detail/${item._id}`}>
          {item.itemCategory}
        </Link>
      </td>
      <td>
        {" "}
        <Link key={index} to={`/product-detail/${item._id}`}>
          ${item.itemPrice}
        </Link>
      </td>
      <td>
        {" "}
        <Link key={index} to={`/product-detail/${item._id}`}>
          {item.itemRating}
        </Link>
      </td>
      <td>
        {" "}
        <Link key={index} to={`/product-detail/${item._id}`}>
          {item.itemQuantity}
        </Link>
      </td>
    </tr>
  );

  return (
    <div>
      <h2 className="page-header">Products</h2>
      <button onClick={handleToggle} style={buttonStyle}>
        Create
      </button>
      <CustomModal
        toggle={toggle}
        handleToggle={handleToggle}
        setIsLoading={setIsLoading}
      />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {isLoading === false && data.length !== 0 && (
                <Table
                  limit="10"
                  headData={customerTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={data}
                  renderBody={(item, index) => renderBody(item, index)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const buttonStyle = {
  background: "var(--main-color)",
  color: "#fff",
  padding: 12,
  paddingRight: 18,
  paddingLeft: 18,
  borderRadius: 12,
  marginBottom: 10,
  "&:hover": {
    opacity: 0.5,
  },
};

export default Products;
