import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
const Orders = () => {
  const [data, setData] = useState([]);
  const [toggle] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const getData = async () => {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_API}/admin/allorders`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const response = await request.json();
        setData(response.message.items);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [toggle, isLoading]);
  const customerTableHead = [
    "Id",
    "User Name",
    "Item Name",
    "Order Quantity",
    "Total Price",
    "Item Image",
  ];
  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item._id}</td>
      <td>{item.username}</td>
      <td>{item.itemName}</td>
      <td>{item.orderQuantity}</td>
      <td>{item.orderPrice}</td>
      <td>
        <img alt="products" style={{ width: 40, height: 40 }} src={item.itemImage} />
      </td>
    </tr>
  );

  return (
    <div>
      <h2 className="page-header">Orders In System</h2>
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

export default Orders;
