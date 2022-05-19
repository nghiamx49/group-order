import React from "react";
import { connect } from "react-redux";

const UserProfile = ({ authenticateReducer }) => {
  const { account } = authenticateReducer;
  return (
    <div className="w-full relative mt-4 shadow-2xl rounded my-24 overflow-hidden">
      <div className="top h-64 w-full bg-blue-600 overflow-hidden relative">
        <div className="flex flex-col justify-center items-center relative h-full bg-pink bg-opacity-50 text-white">
          <img
            alt="person"
            src="https://hhppaper.com/anh_co_dong/default-image.png"
            className="h-24 w-24 object-cover rounded-full"
          />
          <h1 className="text-2xl font-semibold">{account.fullname}</h1>
          <h4 className="text-sm font-semibold">22</h4>
        </div>
      </div>
      <div className="grid grid-cols-12 bg-white ">
        <div className="col-span-12 w-full px-3 py-6 justify-center flex space-x-4 border-b border-solid md:space-x-0 md:space-y-4 md:flex-col md:col-span-2 md:justify-start ">
          <a
            href="https://github.com/huynbt209/Group-Order-Project"
            className="text-sm p-2 bg-indigo-900 text-white text-center rounded font-bold"
          >
            Basic Information
          </a>

          {/* <a href="#" className="text-sm p-2 bg-indigo-200 text-center rounded font-semibold hover:bg-indigo-700 hover:text-gray-200">Another Information</a>

      <a href="#" className="text-sm p-2 bg-indigo-200 text-center rounded font-semibold hover:bg-indigo-700 hover:text-gray-200">Another Something</a> */}
        </div>

        <div className="col-span-12 md:border-solid md:border-l md:border-black md:border-opacity-25 h-full pb-12 md:col-span-10">
          <div className="px-4 pt-4">
            <form action="#" className="flex flex-col space-y-8">
              <div>
                <h3 className="text-2xl font-semibold">Basic Information</h3>
                <hr />
              </div>

              <div className="form-item">
                <label className="text-xl ">Full Name</label>
                <input
                  type="text"
                  value={account.fullname}
                  className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2  mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200"
                  disabled
                />
              </div>

              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                <div className="form-item w-full">
                  <label className="text-xl ">Username</label>
                  <input
                    type="text"
                    value={account.username}
                    className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200 text-opacity-25 "
                    disabled
                  />
                </div>

                <div className="form-item w-full">
                  <label className="text-xl ">Role</label>
                  <input
                    type="text"
                    value={account.role}
                    className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200 text-opacity-25 "
                    disabled
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold ">More About Me</h3>
                <hr />
              </div>

              <div className="form-item w-full">
                <label className="text-xl ">Biography</label>
                <textarea
                  cols="30"
                  rows="10"
                  className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200 text-opacity-25 "
                  disabled
                  value={"Yêu màu tím, Ghét sự giả dối ♥!"}
                ></textarea>
              </div>

              <div>
                <h3 className="text-2xl font-semibold">My Social Media</h3>
                <hr />
              </div>

              <div className="form-item">
                <label className="text-xl ">Instagram</label>
                <input
                  type="text"
                  value="https://instagram.com/"
                  className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200 text-opacity-25 "
                  disabled
                />
              </div>
              <div className="form-item">
                <label className="text-xl ">Facebook</label>
                <input
                  type="text"
                  value="https://facebook.com/"
                  className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2 mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200 text-opacity-25 "
                  disabled
                />
              </div>
              <div className="form-item">
                <label className="text-xl ">Twitter</label>
                <input
                  type="text"
                  value="https://twitter.com/"
                  className="w-full appearance-none text-black text-opacity-50 rounded shadow py-1 px-2  mr-2 focus:outline-none focus:shadow-outline focus:border-blue-200  "
                  disabled
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { authenticateReducer } = state;
  return {
    authenticateReducer,
  };
};

export default connect(mapStateToProps)(UserProfile);
