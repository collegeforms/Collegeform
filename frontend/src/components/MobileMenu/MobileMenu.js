import React, { Fragment, useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiInfo, 
  FiBook, 
  FiGlobe, 
  FiCalendar, 
  FiUser, 
  FiLogOut, 
  FiUserPlus,
  FiMenu,
  FiX,
  FiChevronDown
} from "react-icons/fi";
import "./style.css";

const menus = [
  { id: 1, title: "Home", link: "/home", icon: <FiHome /> },
  {
    id: 2,
    title: "Colleges",
    icon: <FiInfo />,
    subMenu: [
      {
        title: "UG",
        link: "/colleges/?course=&specialization=&currentCity=&preferredCity=&exam=&level=UG&mode=&fees=&payment=",
      },
      {
        title: "PG",
        link: "/colleges/?course=&specialization=&currentCity=&preferredCity=&exam=&level=PG&mode=&fees=&payment=",
      },
      {
        title: "Certification / Diploma",
        link: "/education/vocational-institutes",
      },
    ],
  },
  { id: 3, title: "Quiz", link: "/students/tests", icon: <FiBook /> },
  { id: 6, title: "Study Abroad", link: "/studyabroad", icon: <FiGlobe /> },
  { id: 5, title: "Events", link: "/events", icon: <FiCalendar /> },
  { id: 8, title: "Course Counseling", link: "https://thecounselingcafe.in/", icon: <FiBook /> },
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
    setOpenDropdowns(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({});
  };

  return (
    <div>
      {/* Mobile Menu */}
      <div className={`mobileMenu ${menuActive ? "show" : ""}`}>
        <div className="menu-close">
          <div className="clox" onClick={() => {
            setMenuState(false);
            closeAllDropdowns();
          }}>
            <FiX size={24} />
          </div>
        </div>

        <ul className="responsivemenu">
          {menus.map((item) => (
            <ListItem key={item.id} style={{borderBottom: '1px solid #333', padding: '0'}}>
              {item.subMenu ? (
                <div style={{width: '100%'}}>
                  <div
                    onClick={() => toggleDropdown(item.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      width: "100%",
                      padding: "13px 20px",
                      color: '#fff'
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{color: '#fff', marginRight: '12px', fontSize: '18px'}}>{item.icon}</span>
                      <span style={{color: '#fff'}}>{item.title}</span>
                    </div>
                    <FiChevronDown 
                      style={{ 
                        color: '#fff',
                        transform: openDropdowns[item.id] ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease"
                      }} 
                    />
                  </div>

                  {/* Dropdown content */}
                  {openDropdowns[item.id] && (
                    <ul className="subMenu" style={{margin: 0, padding: 0}}>
                      {item.subMenu.map((sub, i) => (
                        <li key={i} style={{listStyle: 'none'}}>
                          <NavLink 
                            to={sub.link} 
                            onClick={ClickHandler}
                            style={({ isActive }) => ({
                              display: "block",
                              padding: "10px 20px 10px 40px",
                              textDecoration: "none",
                              color: isActive ? "#1976d2" : "#ddd",
                              backgroundColor: isActive ? "#2a2740" : "transparent",
                              borderLeft: "3px solid transparent",
                              borderLeftColor: isActive ? "#1976d2" : "transparent",
                              transition: "all 0.3s ease",
                            })}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#2a2740";
                              e.target.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.color = "#ddd";
                              }
                            }}
                          >
                            {sub.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink 
                  to={item.link} 
                  onClick={ClickHandler}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "13px 20px",
                    textDecoration: "none",
                    color: isActive ? "#1976d2" : "#fff",
                    backgroundColor: isActive ? "#2a2740" : "transparent",
                    borderLeft: "3px solid transparent",
                    borderLeftColor: isActive ? "#1976d2" : "transparent",
                  })}
                  className="mobile-menu-link"
                >
                  <span style={{marginRight: '12px', fontSize: '18px'}}>{item.icon}</span>
                  {item.title}
                </NavLink>
              )}
            </ListItem>
          ))}

          {/* Authenticated User Menu */}
          {authToken ? (
            <Fragment>
              <ListItem style={{borderBottom: '1px solid #333', padding: '0'}}>
                <NavLink 
                  to="/myaccount" 
                  onClick={ClickHandler}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "13px 20px",
                    textDecoration: "none",
                    color: isActive ? "#1976d2" : "#fff",
                    backgroundColor: isActive ? "#2a2740" : "transparent",
                    borderLeft: "3px solid transparent",
                    borderLeftColor: isActive ? "#1976d2" : "transparent",
                  })}
                >
                  <FiUser style={{ marginRight: '12px', fontSize: '18px' }} />
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
                  borderBottom: '1px solid #333',
                }}
                className="mobile-menu-link"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#2a2740";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#fff";
                }}
              >
                <FiLogOut style={{ marginRight: '12px', fontSize: '18px' }} />
                Logout
              </ListItem>
            </Fragment>
          ) : (
            <ListItem style={{borderBottom: '1px solid #333', padding: '0'}}>
              <NavLink 
                to="/user/signup" 
                onClick={ClickHandler}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "13px 20px",
                  textDecoration: "none",
                  color: isActive ? "#1976d2" : "#fff",
                  backgroundColor: isActive ? "#2a2740" : "transparent",
                  borderLeft: "3px solid transparent",
                  borderLeftColor: isActive ? "#1976d2" : "transparent",
                })}
              >
                <FiUserPlus style={{ marginRight: '12px', fontSize: '18px' }} />
                Sign Up
              </NavLink>
            </ListItem>
          )}
        </ul>
      </div>

      {/* Mobile Menu Button */}
      <div className="showmenu" onClick={() => setMenuState(!menuActive)}>
        <button type="button" className="navbar-toggler open-btn">
          <FiMenu size={24} style={{color: '#547DBC'}} />
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;