import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Chart from "react-apexcharts";

import { connect } from "react-redux";

import StatusCard from "../components/status-card/StatusCard";

import Table from "../components/table/Table";

import Badge from "../components/badge/Badge";

const chartOptions = {
  series: [
    {
      name: "Online Customers",
      data: [40, 70, 20, 90, 36, 80, 30, 91, 60],
    },
    {
      name: "Store Customers",
      data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10],
    },
  ],
  options: {
    color: ["#6ab04c", "#2980b9"],
    chart: {
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
    legend: {
      position: "top",
    },
    grid: {
      show: false,
    },
  },
};

const orderStatus = {
  shipping: "primary",
  pending: "warning",
  paid: "success",
};

const Dashboard = ({ themeReducer }) => {
  const [state, setState] = useState({
    statusCards: [],
    topCustomers: {
      head: ["user", "total orders", "total spending"],
      body: [],
    },
    latestOrders: {
      header: ["order id", "user", "total price", "date", "status"],
      body: [],
    },
  });

  const { statusCards, latestOrders, topCustomers } = state;

  useEffect(() => {
    const getDashBoard = async () => {
      try {
        const request = await fetch(`${process.env.REACT_APP_API}/admin/`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await request.json();
        setState(response);
      } catch (error) {
        console.log(error);
      }
    };
    getDashBoard();
  }, []);

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.user}</td>
      <td>{item.price}</td>
      <td>{item.date}</td>
      <td>
        <Badge type={orderStatus[item.status]} content={item.status} />
      </td>
    </tr>
  );
  const renderCusomerHead = (item, index) => <th key={index}>{item}</th>;

  const renderCusomerBody = (item, index) => (
    <tr key={index}>
      <td>{item.username}</td>
      <td style={{ textAlign: "center" }}>{item.order}</td>
      <td style={{ textAlign: "center" }}>${item.price}</td>
    </tr>
  );

  return (
    <div>
      <h2 className="page-header">Dashboard</h2>
      <div className="row">
        <div className="col-6">
          <div className="row">
            {statusCards.map((item, index) => (
              <div className="col-6" key={index}>
                <StatusCard
                  icon={item.icon}
                  count={item.count}
                  title={item.title}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-6">
          <div className="card full-height">
            {/* chart */}
            <Chart
              options={
                themeReducer.mode === "theme-mode-dark"
                  ? {
                      ...chartOptions.options,
                      theme: { mode: "dark" },
                    }
                  : {
                      ...chartOptions.options,
                      theme: { mode: "light" },
                    }
              }
              series={chartOptions.series}
              type="line"
              height="100%"
            />
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card__header">
              <h3>top customers</h3>
            </div>
            <div className="card__body">
              {topCustomers.body.length !== 0 && (
                <Table
                  headData={topCustomers.head}
                  renderHead={(item, index) => renderCusomerHead(item, index)}
                  bodyData={topCustomers.body}
                  renderBody={(item, index) => renderCusomerBody(item, index)}
                />
              )}
            </div>
            <div className="card__footer">
              <Link to="/customers">view all</Link>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="card">
            <div className="card__header">
              <h3>latest orders</h3>
            </div>
            <div className="card__body">
              {latestOrders.body.length !== 0 && (
                <Table
                  headData={latestOrders.header}
                  renderHead={(item, index) => renderOrderHead(item, index)}
                  bodyData={latestOrders.body}
                  renderBody={(item, index) => renderOrderBody(item, index)}
                />
              )}
            </div>
            <div className="card__footer">
              <Link to="/orders">view all</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProp = (state) => {
  const { themeReducer } = state;
  return {
    themeReducer,
  };
};

export default connect(mapStateToProp)(Dashboard);
