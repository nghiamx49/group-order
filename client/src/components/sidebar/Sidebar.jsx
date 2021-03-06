import React from "react";

import { Link } from "react-router-dom";

import { useLocation } from "react-router-dom";

import "./sidebar.css";

import logo from "../../assets/images/logo.png";

const sidebar_items = [
  {
    display_name: "Dashboard",
    route: "/dashboard",
    icon: "bx bx-category-alt",
  },
  {
    display_name: "Customers",
    route: "/customers",
    icon: "bx bx-user-pin",
  },
  {
    display_name: "Products",
    route: "/all-products",
    icon: "bx bx-package",
  },
  {
    display_name: "Order",
    route: "/all-orders",
    icon: "bx bx-money",
  },
  {
    display_name: "Import Product",
    route: "/import",
    icon: "bx bx-import",
  },
];

const SidebarItem = (props) => {
  const active = props.active ? "active" : "";

  return (
    <div className="sidebar__item">
      <div className={`sidebar__item-inner ${active}`}>
        <i className={props.icon}></i>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const location = useLocation();
  const activeItem = sidebar_items.findIndex(
    (item) => item.route === location.pathname
  );

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="company logo" />
      </div>
      {sidebar_items.map((item, index) => (
        <Link to={item.route} key={index}>
          <SidebarItem
            title={item.display_name}
            icon={item.icon}
            active={index === activeItem}
          />
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
