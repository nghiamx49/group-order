import React, { useState, useEffect } from "react";

import Table from "../components/table/Table";

const Customers = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_API}/admin/alluser`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const response = await request.json();
        setData(response.allUser);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);
  const customerTableHead = ["Id", "Name", "Username", "Image", "Created At"];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item._id}</td>
      <td>{item.fullname}</td>
      <td>{item.username}</td>
      <td>
        <img
          alt="vn"
          style={{ width: 40, height: 40, borderRadius: 50 }}
          src={
            item.image ||
            "https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg"
          }
        />
      </td>
      <td>{item.createdAt}</td>
    </tr>
  );

  return (
    <div>
      <h2 className="page-header">customers</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {data.length !== 0 && (
                <Table
                  limit="7"
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

export default Customers;
