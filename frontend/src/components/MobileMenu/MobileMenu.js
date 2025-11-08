import React, { Fragment, useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiInfo,
  FiBook,
  FiUser,
  FiLogOut,
  FiUserPlus,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import "./style.css";

const ugCourses = [
  { name: "BBA", query: "BBA" },
  { name: "BBA LLB", query: "BBA LLB" },
  { name: "B.Com", query: "B.Com" },
  { name: "BCA", query: "BCA" },
  { name: "B.Tech", query: "B.Tech" },
];

const pgCourses = [
  { name: "MBA", query: "MBA" },
  { name: "PGDM", query: "PGDM" },
  { name: "LLB", query: "LLB" },
  { name: "M.Com", query: "M.Com" },
  { name: "MCA", query: "MCA" },
];

const menus = [
  { id: 1, title: "Home", link: "/home", icon: <FiHome /> },
  {
    id: 2,
    title: "Courses",
    icon: <FiBook />,
    subMenu: [
      {
        title: "UG Courses (Bachelor's)",
        items: ugCourses.map((c) => ({
          label: c.name,
          link: `/colleges/?course=${encodeURIComponent(c.query)}&level=UG`,
        })),
      },
      {
        title: "PG Courses (Master's)",
        items: pgCourses.map((c) => ({
          label: c.name,
          link: `/colleges/?course=${encodeURIComponent(c.query)}&level=PG`,
        })),
      },
      {
        title: "Explore More",
        items: [
          {
            label: "View All Courses",
            link: "/colleges",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Colleges",
    icon: <FiInfo />,
    subMenu: [
      {
        title: "UG Colleges",
        link: "/colleges/?course=&specialization=&currentCity=&preferredCity=&exam=&level=UG&mode=&fees=&payment=",
      },
      {
        title: "PG Colleges",
        link: "/colleges/?course=&specialization=&currentCity=&preferredCity=&exam=&level=PG&mode=&fees=&payment=",
      },
      {
        title: "Diploma Colleges",
        link: "/education/vocational-institutes",
      },
    ],
  },
  { id: 4, title: "Course Counseling", link: "https://thecounselingcafe.in/", icon: <FiBook /> },
];

const MobileMenu = () => {
  const [menuActive, setMenuState] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setAuthToken(token);
  }, []);

  const ClickHandler = () => {
    window.scrollTo(10, 0);
    setMenuState(false);
    closeAllDropdowns();
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setAuthToken(null);
    navigate("/");
  };

  const toggleDropdown = (menuId) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const closeAllDropdowns = () => setOpenDropdowns({});

  return (
    <div>
      {/* Mobile Menu */}
      <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
        <div className="menu-close">
          <div
            className="clox"
            onClick={() => {
              setMenuState(false);
              closeAllDropdowns();
            }}
          >
            <FiX size={24} />
          </div>
        </div>

        <ul className="responsivemenu">
          {menus.map((item) => (
            <ListItem key={item.id} style={{ borderBottom: "1px solid #333", padding: 0 }}>
              {item.subMenu ? (
                <div style={{ width: "100%" }}>
                  <div
                    onClick={() => toggleDropdown(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      width: "100%",
                      padding: "13px 20px",
                      color: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ color: "#fff", marginRight: "12px", fontSize: "18px" }}>
                        {item.icon}
                      </span>
                      <span style={{ color: "#fff" }}>{item.title}</span>
                    </div>
                    <FiChevronDown
                      style={{
                        color: "#fff",
                        transform: openDropdowns[item.id]
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>

                  {/* Dropdown content */}
                  {openDropdowns[item.id] && (
                    <div style={{ background: "#1b1833", padding: "8px 0" }}>
                      {item.subMenu.map((sub, i) => (
                        <div key={i} style={{ padding: "6px 0" }}>
                          <p
                            style={{
                              color: "#aaa",
                              fontSize: "14px",
                              margin: "5px 20px 8px",
                              fontWeight: 500,
                            }}
                          >
                            {sub.title}
                          </p>
                          {sub.items ? (
                            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                              {sub.items.map((inner, j) => (
                                <li key={j}>
                                  <NavLink
                                    to={inner.link}
                                    onClick={ClickHandler}
                                    style={{
                                      display: "block",
                                      padding: "8px 35px",
                                      color: "#ddd",
                                      textDecoration: "none",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {inner.label}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                              <li>
                                <NavLink
                                  to={sub.link}
                                  onClick={ClickHandler}
                                  style={{
                                    display: "block",
                                    padding: "8px 35px",
                                    color: "#ddd",
                                    textDecoration: "none",
                                    fontSize: "14px",
                                  }}
                                >
                                  {sub.title}
                                </NavLink>
                              </li>
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.link}
                  onClick={ClickHandler}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "13px 20px",
                    textDecoration: "none",
                    color: "#fff",
                  }}
                >
                  <span style={{ marginRight: "12px", fontSize: "18px" }}>{item.icon}</span>
                  {item.title}
                </NavLink>
              )}
            </ListItem>
          ))}

          {/* Authenticated User Menu */}
          {authToken ? (
            <Fragment>
              <ListItem style={{ borderBottom: "1px solid #333", padding: 0 }}>
                <NavLink
                  to="/myaccount"
                  onClick={ClickHandler}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "13px 20px",
                    textDecoration: "none",
                    color: "#fff",
                  }}
                >
                  <FiUser style={{ marginRight: "12px", fontSize: "18px" }} />
                  My Account
                </NavLink>
              </ListItem>

              <ListItem
                onClick={() => {
                  handleLogout();
                  ClickHandler();
                }}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "13px 20px",
                  color: "#fff",
                  borderBottom: "1px solid #333",
                }}
              >
                <FiLogOut style={{ marginRight: "12px", fontSize: "18px" }} />
                Logout
              </ListItem>
            </Fragment>
          ) : (
            <ListItem style={{ borderBottom: "1px solid #333", padding: 0 }}>
              <NavLink
                to="/user/signup"
                onClick={ClickHandler}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "13px 20px",
                  textDecoration: "none",
                  color: "#fff",
                }}
              >
                <FiUserPlus style={{ marginRight: "12px", fontSize: "18px" }} />
                Sign Up
              </NavLink>
            </ListItem>
          )}
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <div className="showmenu" onClick={() => setMenuState(!menuActive)}>
        <button type="button" className="navbar-toggler open-btn">
          <FiMenu size={24} style={{ color: "#547DBC" }} />
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
