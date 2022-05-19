import React from "react";

const ProductInCard = ({
  product,
  handleDecreaseOne,
  handleIncreaseOne,
  handleDelete,
  ...rest
}) => {
  const shouldHide = rest?.currentUserId !== rest?.accountId;

  return (
    <li key={product._id} className="py-6 flex">
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
        <img
          src={product.itemImage}
          alt={product.imageAlt}
          className="w-full h-full object-center object-cover"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <span>{product.itemName}</span>
            </h3>
            <p className="ml-4">{product.orderPrice}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{product.color}</p>
        </div>
        <div className="flex items-center mt-2">
          <button
            className="text-gray-500 focus:outline-none focus:text-gray-600"
            onClick={() => handleDecreaseOne(product)}
            style={{ display: shouldHide && "none" }}
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
              <path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
          <span className="text-gray-700 mx-2">x{product.orderQuantity}</span>
          <button
            className="text-gray-500 focus:outline-none focus:text-gray-600"
            onClick={() => handleIncreaseOne(product)}
            style={{ display: shouldHide && "none" }}
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
              <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </button>
        </div>
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex">
            <button
              type="button"
              className="font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => handleDelete(product)}
              style={{ display: shouldHide && "none" }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductInCard;
