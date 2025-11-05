import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons for visibility toggle
import './AuthLogin.css'; // Import custom CSS

const AuthLogin = () => {
    const API_URL =  "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false); // State for toggling password visibility
    const { login } = useContext(AuthContext);

    const { loginAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
         

            await loginAdmin(username, password);

                navigate("/admin/dashboard");
        
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-heading">Welcome Back!</h2>
                <form onSubmit={handleLogin}>
                    <div className="auth-input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="auth-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-input-group password-input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-container">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="password"
                                className="auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="auth-btn">Sign In</button>
                </form>
                {/* <div className="auth-footer">
                    <p>Don't have an account? <a href="/signup">Sign up</a></p>
                    <p>Or go to <a href="/admin/dashboard">Dashboard</a></p>
                </div> */}
            </div>
        </div>
    );
};

export default AuthLogin;
