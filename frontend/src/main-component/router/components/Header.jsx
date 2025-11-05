import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUser ,Add } from 'react-icons/ai';


import "./style.css";

function Header() {
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [token, setToken] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const savedToken = localStorage.getItem("userToken");
    setToken(savedToken);
  }, []);

  const toggleOffCanvas = () => {
    setIsOffCanvasOpen(!isOffCanvasOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    navigate("/user/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand fw-bold text-uppercase" to="/">
          <img src="/img/college-logo-2.png" width="250px" alt="College Logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleOffCanvas}
          aria-controls="offcanvasNavbar"
          aria-expanded={isOffCanvasOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Header items for large screens */}
        <div className="collapse navbar-collapse d-none d-md-block" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-5">
            <li className="nav-item mt-2">
              <Link className="nav-link active text-dark px-3" to="/counseling">
                <i className="fa-regular fa-circle-question me-1"></i>  Counseling
              </Link>
            </li>

            {/* <li className="nav-item mt-2">
              <a className="nav-link active num text-light px-3" href="tel:7389667279">
                <i className="fa-solid fa-phone me-2"></i> 7389667279
              </a>
            </li> */}

            {/* Show Profile or Login/Signup */}
            <li className="nav-item mt-2">
              {token ? (
         
         <li className="nav-item dropdown">
         <a
           href="#"
           className="nav-link dropdown-toggle profile-dropdown"
           id="profileDropdown"
           role="button"
         >
           <i className="fa-solid fa-user me-1"></i> Profile
         </a>
         <ul className="dropdown-menu">
           <li>
             <Link className="dropdown-item" to="/profile">My Profile</Link>
           </li>
           <li>
             <button className="dropdown-item text-danger" onClick={handleLogout}>
               Logout
             </button>
           </li>
         </ul>
       </li>
              ) : (
                <li className="nav-item ">
                <Link to={"/user/signup"} className="nav-link active num text-light px-3">
         
                  
                   SignUp
<AiOutlineUser Add className="ms-2" />

                </Link>
              </li>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Offcanvas Menu for smaller screens */}
      <div className={`offcanvas offcanvas-end d-md-none d-block ${isOffCanvasOpen ? 'show' : ''}`} id="offcanvasNavbar">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Navigation</h5>
          <button type="button" className="btn-close" onClick={toggleOffCanvas} aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/courses">Courses</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/admission">Admission</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>

            {/* Show Profile or Login/Signup in Mobile */}
            <li className="nav-item mt-2">
              {token ? (
                <div className="d-flex flex-column align-items-center gap-2">
                  <Link className="nav-link text-dark px-3" to="/profile">
                    <i className="fa-solid fa-user me-1"></i> Profile
                  </Link>
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <Link className="btn btn-primary w-100 text-center" to="/login">Login / Signup</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
