import React, { useEffect,useState } from "react";
import $ from "jquery";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel"; // Import Slick JS
import { Link } from "react-router-dom";
import "./style.css"
import Header from "./Header";
// Import Swiper components
import Logos from "./Logos";
import Testimonial from "./Testimonials";
import Colleges from "./Colleges";
const Home = () => {
  useEffect(() => {
    // Initialize Slick slider when the component is mounted
    $(".banner-slider").slick({
      autoplay: true,
      autoplaySpeed: 3000, // 3 seconds
      arrows: true,
      dots: true,
      infinite: true,
      speed: 600,
      fade: true, // Smooth fade effect
      cssEase: "linear",
      prevArrow:
        '<button type="button" class="slick-prev"><i class="fa fa-chevron-left"></i></button>',
      nextArrow:
        '<button type="button" class="slick-next"><i class="fa fa-chevron-right"></i></button>',
    });

    // Cleanup Slick slider when component is unmounted
    return () => {
      $(".banner-slider").slick("unslick");
    };
  }, []); // Empty dependency array to run once when the component mounts



  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // Fetch banners from the API
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/banners");
        setBanners(response.data); // Set banners in state
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);
  return (
    <>

<Header/>
      <div>
        

      <div className="banner-slider">
          {banners.map((banner) => (
            <div key={banner.id}>
              <img src={`http://localhost:5000${banner.image}`} alt="img" />
            </div>
          ))}
        </div>
      </div>

      <div class="slider-container">
        <div class="slider-track">
          <div class="slider-item">
            Indian Institute of Technology (IIT) Delhi - Est. 1961
          </div>
          <div class="slider-item">
            Indian Institute of Technology (IIT) Bombay - Est. 1958
          </div>
          <div class="slider-item">
            Indian Institute of Science (IISc) Bangalore - Est. 1909
          </div>
          <div class="slider-item">University of Delhi - Est. 1922</div>
          <div class="slider-item">
            Banaras Hindu University (BHU) - Est. 1916
          </div>
          <div class="slider-item">
            Jawaharlal Nehru University (JNU) - Est. 1969
          </div>
          <div class="slider-item">
            Indian Institute of Technology (IIT) Madras - Est. 1959
          </div>
          <div class="slider-item">University of Calcutta - Est. 1857</div>
          <div class="slider-item">University of Mumbai - Est. 1857</div>
          <div class="slider-item">
            Indian Institute of Technology (IIT) Kanpur - Est. 1959
          </div>
          <div class="slider-item">
            Indian Institute of Technology (IIT) Delhi - Est. 1961
          </div>
          <div class="slider-item">
            Indian Institute of Technology (IIT) Bombay - Est. 1958
          </div>
          <div class="slider-item">
            Indian Institute of Science (IISc) Bangalore - Est. 1909
          </div>
          <div class="slider-item">University of Delhi - Est. 1922</div>
          <div class="slider-item">
            Banaras Hindu University (BHU) - Est. 1916
          </div>
          <div class="slider-item">
            Jawaharlal Nehru University (JNU) - Est. 1969
          </div>
          <div class="slider-item">
            Indian Institute of Technology (IIT) Madras - Est. 1959
          </div>
          <div class="slider-item">University of Calcutta - Est. 1857</div>
          <div class="slider-item">University of Mumbai - Est. 1857</div>
          <div class="slider-item">
            Indian Institute of Technology (IIT) Kanpur - Est. 1959
          </div>
        </div>
      </div>

      <div class="container text-center py-4 mb-3">
        <div class="row">
          <div class="col-12">
            <h1 class="display-4 fw-bold">
              <span class="highlight">500+ Colleges</span>,
              <span class="main-text">1 Application Form</span>
            </h1>
            <p class="lead main-text">
              Applying to your dream colleges made easy!
            </p>
            <button
              type="button"
              class=" shake-button p-3 px-5 text-light"
              data-bs-toggle="modal"
              data-bs-target="#admissionFormModal"
            >
              Apply Now
              <span class="svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="20"
                  viewBox="0 0 38 15"
                  fill="none"
                >
                  <path
                    fill="white"
                    d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <section class="cities-section py-5">
        <div class="container-fluid">
          <h1 class="section-titl text-center fw-bolder mb-5">
            Top Cities for Admission
       
          </h1>

          <div class="row g-4 gap-1 justify-content-center">
          <div className="col-lg-2 col-md-6">
            <Link to="/colleges/Mumbai">
              <div className="city-card position-relative">
                <img
                  src="https://www.holidify.com/images/bgImages/MUMBAI.jpg"
                  className="img-fluid"
                  alt="Mumbai"
                />
                <div className="city-info">
                  <h4 className="text-white text-center">Mumbai</h4>
                </div>
              </div>
            </Link>
          </div>
            <div class="col-lg-2 col-md-6">
            <Link to="/colleges/Pune">
              <div class="city-card position-relative">
                <img
                  src="https://www.mistay.in/travel-blog/content/images/2023/03/Shaniwaarwada_Pune.jpg"
                  class="img-fluid"
                  alt="Pune"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">Pune</h4>
                </div>
              </div>
             </Link>
            </div>

            <div class="col-lg-2 col-md-6">
            <Link to="/colleges/Bangalore">
              <div class="city-card position-relative">
                <img
                  src="https://lp-cms-production.imgix.net/2019-06/9483508eeee2b78a7356a15ed9c337a1-bengaluru-bangalore.jpg"
                  class="img-fluid"
                  alt="Bangalore"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">Bangalore</h4>
                </div>
              </div>
              </Link>
            </div>

            <div class="col-lg-2 col-md-6">

            <Link to="/colleges/Ahmedabad">
              <div class="city-card position-relative">
                <img
                  src="https://myjourneythroughindia.wordpress.com/wp-content/uploads/2015/12/night-view-of-akshardham-temple-ahmedabad.jpg"
                  class="img-fluid"
                  alt="Ahmedabad"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">Ahmedabad</h4>
                </div>
              </div>
              </Link>
            </div>

            <div class="col-lg-2 col-md-6">
              <Link to="/colleges/Dehradun">
              <div class="city-card position-relative">
                <img
                  src="https://www.holidify.com/images/bgImages/DEHRADUN.jpg"
                  class="img-fluid"
                  alt="Dehradun"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">Dehradun</h4>
                </div>
              </div>
              </Link>
            </div>

            <div class="col-lg-2 col-md-6">
            <Link to="/colleges/Delhi">
              <div class="city-card position-relative">
                <img
                  src="https://cdn.britannica.com/37/189837-050-F0AF383E/New-Delhi-India-War-Memorial-arch-Sir.jpg"
                  class="img-fluid"
                  alt="Delhi"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">Delhi</h4>
                </div>
              </div>
              </Link>
            </div>

            <div class="col-lg-2 col-md-6">
              <Link to="/colleges/NCR">
              <div class="city-card position-relative">
                <img
                  src="https://www.luxuryresidences.in/trump-towers-sector-65-gurgaon/images/mobile-banner.webp"
                  class="img-fluid"
                  alt="NCR"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">
                    NCR (Gurugram/Noida/Greater Noida)
                  </h4>
                </div>
              </div>
              </Link>
            </div>

            <div class="col-lg-2 col-md-6">

              <Link to="/colleges/Jaipur">
              <div class="city-card position-relative">
                <img
                  src="https://media.istockphoto.com/id/1398087835/photo/pink-palace-hawa-mahal-jaipur-india-beautiful-sunset-view.jpg?s=612x612&w=0&k=20&c=S8X6bk4Mdp0xu624dFZCHfobotdwdIp7K1FEQJV6hkI="
                  class="img-fluid"
                  alt="Jaipur"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">Jaipur</h4>
                </div>
              </div>
              </Link>
            </div>

            <div class="col-lg-2 col-md-6">
              <Link to="/colleges/Hyderabad">
              <div class="city-card position-relative">
                <img
                  src="https://www.holidify.com/images/bgImages/HYDERABAD.jpg"
                  class="img-fluid"
                  alt="Hyderabad"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">Hyderabad</h4>
                </div>
              </div>
              </Link>
            </div>

            <div class="col-lg-2 col-md-6">
              <Link to="/colleges/Indore">
              <div class="city-card position-relative">
                <img
                  src="https://www.holidify.com/images/cmsuploads/compressed/3551_20190228103219.jpg"
                  class="img-fluid"
                  alt="Indore"
                />
                <div class="city-info">
                  <h4 class="text-white text-center">Indore</h4>
                </div>
              </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Logos />

      <div class="container pb-5">
        <div class="about-us pt-5 mt-5">
          <div class="heading text-center">
            <h1>
              <span> How It </span> Works ?
              <span class="svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="70"
                  height="40"
                  viewBox="0 0 38 15"
                  fill="none"
                >
                  <path
                    fill="#1B7AFF"
                    d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"
                  ></path>
                </svg>
              </span>
            </h1>
            <p class="py-2 fs-5">
              At Collegeforms.in, we believe that making the right educational
              choices should be a seamless experience. We offer a comprehensive,
              user-friendly service that covers everything a student needs when
              it comes to college applications:
            </p>
          </div>
          <div class="row justify-content-center mt-2">
            <div class="col-md-12">
              <img
                width="100%"
                src="https://nj1-static.collegedekho.com/_next/static/media/admission-process-new.fdb7fefa.gif?width=1200&q=80"
                alt=""
              />
            </div>
          </div>

          <div style={{ marginTop: "150px" }} class="row">
            <div class="col-md-3">
              <div class="feature-box">
                <div class="icon">
                  <img
                    src="https://cdn3d.iconscout.com/3d/premium/thumb/search-3d-icon-download-in-png-blend-fbx-gltf-file-formats--zoom-logo-find-magnifier-seo-ecommerce-icons-pack-e-commerce-shopping-4183755.png?f=webp"
                    style={{ marginTop: "-100px" }}
                    width="300px"
                    alt=""
                  />
                </div>
                <div>
                  <h6 class="fs-4 mt-3 text-center">Search Colleges</h6>
                </div>
              </div>
            </div>

            <div class="col-md-3 second-box">
              <div class="feature-box">
                <div class="icon">
                  <img
                    src="https://cdn3d.iconscout.com/3d/premium/thumb/OnlineEducation-3d-icon-download-in-png-blend-fbx-gltf-file-formats--learning-e-study-website-pack-design-development-icons-9779173.png?f=webp"
                    style={{ marginTop: "-100px" }}
                    width="300px"
                    alt="College Courses"
                  />
                </div>
                <div>
                  <h6 class="fs-4 mt-3">Fill CAF Form</h6>
                </div>
              </div>
            </div>

            <div class="col-md-3 second-box">
              <div class="feature-box">
                <div class="icon">
                  <img
                    src="https://cdn3d.iconscout.com/3d/premium/thumb/payment-3d-icon-download-in-png-blend-fbx-gltf-file-formats--money-finance-cash-ecommerce-pack-e-commerce-shopping-icons-5272924.png?f=webp"
                    style={{ marginTop: "-100px" }}
                    width="300px"
                    alt=""
                  />
                </div>
                <div>
                  <h6 class="fs-4 mt-3">Make A Payment</h6>
                </div>
              </div>
            </div>

            <div class="col-md-3 second-box">
              <div class="feature-box">
                <div class="icon">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/024/658/938/non_2x/3d-male-character-gets-an-idea-while-sitting-on-a-sofa-and-working-on-a-laptop-free-png.png"
                    style={{ marginTop: "-100px" }}
                    width="300px"
                    alt=""
                  />
                </div>
                <div>
                  <h6 class="fs-4 mt-3">Get Free Counseling</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <Colleges/>

      <div class="hero-section">
        <div class="container py-5">
          <h1>Let’s Get Started</h1>
          <p>
            At Collegeforms.in, we’re committed to helping students and parents
            make confident decisions about education. Explore your options, get
            expert advice, and apply to top colleges—all with just a few clicks.
          </p>
          <br />
          <a href="dump3.html" class=" shake-button text-light p-3 px-4 mt-5">
            Find Your Dream College
          </a>
        </div>
      </div>

      <Testimonial />

      <div class="container mt-5">
        <div class="row">
          <div class="col-md-7">
            <h1 class="section-title text-start fs-1">
              Why Choose Us?
              <span class="svg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="70"
                  height="40"
                  viewBox="0 0 38 15"
                  fill="none"
                >
                  <path
                    fill="#1B7AFF"
                    d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z"
                  ></path>
                </svg>
              </span>
            </h1>

            <p class="icon-text">
              <strong class="fs-5 d-block">
                {" "}
                <i class="fas fa-check-circle"> </i> Comprehensive Solutions :
              </strong>
              From career testing to final application submission, we cover
              every aspect of the admission process.
            </p>
            <p class="icon-text">
              <strong class="fs-5 d-block">
                {" "}
                <i class="fas fa-check-circle"> </i> Expert Guidance :
              </strong>
              Get advice from experienced academic consultants who understand
              the intricacies of the education system.
            </p>
            <p class="icon-text">
              <strong class="fs-5 d-block">
                {" "}
                <i class="fas fa-check-circle"> </i> Time and Cost-Efficiency{" "}
              </strong>
              Save time and money by applying to multiple colleges with our
              Common Application Form, all while enjoying exclusive discounts.
            </p>

            <p class="icon-text">
              <strong class="fs-5 d-block">
                {" "}
                <i class="fas fa-check-circle"> </i> Real-Time Information{" "}
              </strong>
              Make informed decisions with up-to-date student reviews, ratings,
              and comparisons between institutions.
            </p>

            <p class="icon-text">
              <strong class="fs-5 d-block">
                {" "}
                <i class="fas fa-check-circle"> </i> Support Every Step of the
                Way{" "}
              </strong>
              Whether you need help choosing a course, filling out forms, or
              understanding deadlines, we’re here to assist you at every stage.
            </p>
          </div>
          <div class="col-md-5">
            <img
              alt="Freelancer IT Services video thumbnail with play button"
              class="img-fluid video-thumbnail"
              src="https://cdn3d.iconscout.com/3d/premium/thumb/social-media-marketing-3d-icon-download-in-png-blend-fbx-gltf-file-formats--like-logo-promotion-digital-advertisement-and-vol-1-pack-business-icons-5013080.png"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
