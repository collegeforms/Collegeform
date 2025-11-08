import React, { useState } from "react";
import { useNavigate, Link , useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import { Snackbar, Alert } from "@mui/material";

const CollegeCard = ({ college, onApplyClick, selectedCourse }) => {
  const navigate = useNavigate();
    const location = useLocation();

  const { addToCart, isItemInCart, cartCount } = useCart();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const onsendClick = () => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate("/step", { state: { college } });
    } else {
        navigate('/user/login', { 
      state: { from: location } // This preserves the current URL
    });
    }
  };

  const handleAddToCart = async () => {
    if (!selectedCourseDetails) return;

    const cartItemData = {
      collegeId: college.id || college._id,
      collegeName: college.name,
      collegeLocation: college.location,
      collegeImage: college.image,
      courseName: selectedCourseDetails.courseName,
      originalFees: selectedCourseDetails.originalFees,
      discountedFees: selectedCourseDetails.discountedFees,
      slug: college.slug
    };

    try {
      await addToCart(cartItemData);
      showSnackbar("Course added to cart successfully!");
    } catch (error) {
      if (error.message.includes("login")) {
        showSnackbar("Please login to add items to cart", "warning");
        setTimeout(() =>   navigate('/user/login', { 
      state: { from: location } // This preserves the current URL
    }), 1500);
      } else if (error.message.includes("already in cart")) {
        showSnackbar("This course is already in your cart", "info");
      } else {
        showSnackbar("Failed to add course to cart", "error");
      }
    }
  };

  // Get course details based on selected course
  const availableCourses = college.coursePricing || [];
  const selectedCourseDetails = selectedCourse 
    ? availableCourses.find(course => course.courseName === selectedCourse)
    : null;

  const isCourseInCart = selectedCourseDetails 
    ? isItemInCart(college.id || college._id, selectedCourseDetails.courseName)
    : false;

  return (
    <>
      <div className="college-card bg-white border border-2 shadow mb-3 rounded">
        <div className="d-flex justify-content-between pb-0">
          <span className="pb-0 fs-5 fw-bold">
            <i className="fas fa-map-marker-alt pe-2 text-primary"></i>
            <Link 
              to={`/college/${college.slug}`} 
              className="text-dark text-decoration-none"
            >
              {college.name}
            </Link>,{" "}
            <span className="ps-2 text-muted">{college.location}</span>
          </span>
          <span className="px-2 text-light bg-success rounded-2 pt-1">
            <span>{college.rating}</span>
            <i style={{ fontSize: "12px" }} className="ps-1 fi flaticon-star"></i>
          </span>
        </div>

        <hr className="d-none d-md-block" />
        <br className="d-block d-md-none" />

        <div className="row p-0">
          <div className="col-md-4">
            <Link to={`/college/${college.slug}`}>
              <img
                alt={`Image of ${college.name}`}
                src={college.image}
                className="img-fluid college-card-img rounded-2"
              />
            </Link>
          </div>
          <div className="col-md-8">
            <div className="college-info d-flex align-items-center gap-4 mt-0">
              <p className="mb-0">
                ₹ {college.minFees?.toLocaleString("en-IN")} Lakh -{" "}
                {college.maxFees?.toLocaleString("en-IN")} Lakh  
              </p>
              |
              <p className="mb-0">
                {college.exams?.slice(0, 7).join(", ")}
                {college.exams?.length > 7 && " ..."}
              </p>
            </div>
            <p className="mt-2 text-muted" style={{ fontSize: "13px" }}>
              {college.description?.length > 200
                ? `${college.description.slice(0, 450)}...`
                : college.description}
            </p>

            {/* Course Pricing Section - Only show when a course is selected */}
            {selectedCourseDetails ? (
              <div className="course-selection-section mb-1 p-1 ps-3  rounded">
                <div className="row align-items-center g-3 ">
                  <div className="col-md-auto">
                    <div className="text-start">
                      <div style={{backgroundColor:"#4540E1"}} className=" p-1 px-3 rounded-5  text-white   fs-6">
                        {selectedCourseDetails.courseName}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="text-center">
                           <span className="fw-bold text-success me-2">
                        ₹{selectedCourseDetails.discountedFees?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-decoration-line-through text-danger ">
                        ₹{selectedCourseDetails.originalFees?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  
                
                </div>
              </div>
            ) : (
             <></>
            )}

            <div className="pt-2 d-flex align-items-center gap-2 flex-wrap">
              <button
                style={{ backgroundColor: "#4540E1" }}
                className="btn text-white rounded-5 px-4 py-2"
                onClick={onsendClick}
              >
                Apply Now
              </button>

              {/* Removed “More Info” button */}

              {/* Add to Cart Button - Only show when a course is selected */}
              {selectedCourseDetails && (
        <button
  className={`btn rounded-5 px-4 py-2 d-flex align-items-center gap-2 ${
    isCourseInCart 
      ? "btn-success" 
      : ""
  }`}
  style={{
    backgroundColor: isCourseInCart ? '' : '#fdfdffff',
    borderColor: isCourseInCart ? '' : '#4540E1',
    color: isCourseInCart ? '' : '#4540E1'
  }}
  onClick={handleAddToCart}
  disabled={isCourseInCart}
>
  {isCourseInCart ? (
    <>
      <CheckIcon fontSize="small" />
      Added to Cart
    </>
  ) : (
    <>
      Add to Cart
    </>
  )}
</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CollegeCard;
