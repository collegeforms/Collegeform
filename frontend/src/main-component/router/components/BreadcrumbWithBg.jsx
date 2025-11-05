import React from "react";
import { useParams, Link } from "react-router-dom";

const BreadcrumbWithBg = ({ title, backgroundImage }) => {
  const { city } = useParams();

  return (
    <div
      className="relative bg-cover bg-center py-5  h-52 flex items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.93)), url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 text-start container py-3">
        <nav className="text-sm mb-2">
          <Link to="/" className="text-white ">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          {city ? (
            <>
              <Link to="/colleges" className="text-white">
                Colleges
              </Link>
              <span className="mx-2 ">/</span>
              <span className="text-white">{city}</span>
            </>
          ) : (
            <span className="text-white">{title}</span>
          )}
        </nav>
        <h1 className="text-3xl font-bold">{title || `Top Colleges in ${city}`}</h1>
      </div>
    </div>
  );
};

export default BreadcrumbWithBg;
