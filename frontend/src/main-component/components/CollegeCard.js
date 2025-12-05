import React from "react";

const CollegeCard = ({ college, onApplyClick }) => {
  return (
    <div className="college-card bg-white border border-2 shadow mb-3 rounded">
      <div className="d-flex justify-content-between pb-0">
        <span className="pb-0 fs-5 fw-bold">
          <i className="fas fa-map-marker-alt pe-2 text-primary"></i>
          {college.name},{" "}
          <span className="ps-2 text-muted">{college.location}</span>
        </span>

        <span className=" px-2 text-light bg-success rounded-2 pt-1">
          <span className=" ">{college.rating}</span>
          <i className=" ps-1 fi flaticon-star"></i>
        </span>
      </div>

      <hr className="d-none d-md-block" />
      <br className="d-block d-md-none" />

      <div className="row p-0">
        <div className="col-md-4 ">
          <img
            alt={`Image of ${college.name}`}
            src={`https://www.collegeforms.in${college.image}`}
            className="img-fluid college-card-img rounded-2"
          />
        </div>
        <div className="col-md-8 ">
          <div className="college-info d-flex align-items-center gap-4 mt-0">
            <p className="mb-0">
              ₹ {college.minFees.toLocaleString("en-IN")} -{" "}
              {college.maxFees.toLocaleString("en-IN")} INR
            </p>
|

            <p className="mb-0">{college.exams[0] }{", "}{college.exams[1]}</p>
          </div>
          <p className="mt-2 text-muted" style={{ fontSize: "12px" }}>
            {college.description}
          </p>
          <div className="pt-0">
            <button
              className="btn btn-primary rounded-0"
              onClick={() => onApplyClick(college)}
            >
              Apply Now
            </button>
            <button className="btn btn-outline-secondary ms-3 rounded-0">
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;
