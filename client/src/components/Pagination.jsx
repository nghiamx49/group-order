import React from "react";

const Pagination = ({ totalRecords, setPage, currentPage }) => {
  const handlePageChange = (e) => {
    window.scroll(0, 100);
    setPage(e.target.value);
  };

  const handleNext = () => {
    setPage(currentPage + 1);
  };
  const handlePrev = () => {
    setPage(currentPage - 1);
  };

  return (
    <div className="flex flex-col items-center my-12">
      <div className="flex text-gray-700">
        {currentPage > 1 && (
          <button
            onClick={handlePrev}
            className={`h-12 w-12 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-left w-6 h-6"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        <div className="flex h-12 font-medium rounded-full bg-gray-200">
          {Array.from(Array(totalRecords).keys()).map((i) =>
            currentPage === i + 1 ? (
              <button
                key={i + 1}
                value={i + 1}
                onClick={handlePageChange}
                className={`w-12 md:flex justify-center text-red-900 items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full`}
              >
                {i + 1}
              </button>
            ) : (
              <button
                key={i + 1}
                value={i + 1}
                onClick={handlePageChange}
                className={`w-12 md:flex justify-center text-gray-500 items-center hidden cursor-pointer leading-5 transition duration-150 ease-in  rounded-full`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
        {currentPage < totalRecords && (
          <button
            onClick={handleNext}
            className="h-12 w-12 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-chevron-right w-6 h-6"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
