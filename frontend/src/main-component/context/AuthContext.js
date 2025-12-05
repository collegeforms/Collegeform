import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);

    // On App Load
    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        const userInfo = localStorage.getItem("userInfo");
        const adminToken = localStorage.getItem("adminToken");
console.log(userInfo);

        if (userToken && userInfo) {
            setUser({
                token: userToken,
                info: JSON.parse(userInfo),
            });
        }

        if (adminToken) {
            setAdmin({ token: adminToken });
        }
    }, []);

    // User Login
    const loginUser = async (email, password) => {
        try {
            const response = await fetch("https://www.collegeforms.in/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            // Save in localStorage
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userInfo", JSON.stringify(data.user));

            // Save in state
            setUser({
                token: data.token,
                info: data.user,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // Admin Login
    const loginAdmin = async (username, password) => {
        try {
            const response = await fetch("https://www.collegeforms.in/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            localStorage.setItem("adminToken", data.token);
            setAdmin({ token: data.token });
        } catch (error) {
            throw new Error(error.message);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("adminToken");
        setUser(null);
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ user, admin, loginUser, loginAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
