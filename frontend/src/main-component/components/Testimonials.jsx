import React, { useEffect } from 'react';
import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel'; // Import Slick JS

const Testimonials = () => {


    useEffect(() => {

            $(".testimonial-slider").slick({
              autoplay: true, // Auto-play the carousel
              autoplaySpeed: 3000, // Slide every 3 seconds
              dots: false, // Removed dots for navigation
              arrows: true, // Show arrows for navigation
              infinite: true, // Infinite loop of slides
              speed: 1000, // Transition speed (1 second)
              slidesToShow: 2, // Show 2 items at once for desktop
              slidesToScroll: 1, // Scroll 1 item at a time
              responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2, // Show 2 items on medium screens
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: true,
                  },
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1, // Show 1 item on small screens
                    slidesToScroll: 1,
                    arrows: true,
                  },
                },
              ],
            });
          
    


        // Initialize Slick slider when the component is mounted
      
    
        // Cleanup Slick slider when component is unmounted
        return () => {
          $(".testimonial-slider").slick("unslick");
        };
      }, []); // Empty dependency array to run once when the component mounts
    

  return (
    <div>
      

    <div class="testimonial-container">
      <div class="section-heading">
        <h1 class="fw-bold">
        What  Our Students Speak

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
      </div>

      <div class="testimonial-slider">
        <div class="testimonial-slide">
          <div class="testimonial-card">
            <div class="quote-icon">
              <i class="fas fa-quote-left fa-2x"></i>
            </div>
            <img
              alt="Portrait of a person"
              class="testimonial-image"
              
              style={{objectFit:" cover"}}
              src="https://i.pinimg.com/736x/26/1a/54/261a547bce7c810ebaa5a2291edb1571.jpg"
            />
            <p class="pt-3">
              "This college provided me with all the resources I needed to
              succeed. The faculty is highly supportive, and I received
              excellent guidance throughout my journey."
            </p>
            <h5 class="mb-0"><strong>Aarav Kumar</strong></h5>
            <p class="text-muted">B.Tech, Computer Science</p>
            <div class="stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <div class="quote-icon-right">
              <i class="fas fa-quote-right fa-2x text-white"></i>
            </div>
          </div>
        </div>

        <div class="testimonial-slide">
          <div class="testimonial-card">
            <div class="quote-icon">
              <i class="fas fa-quote-left fa-2x"></i>
            </div>
            <img
              alt="Portrait of a person"
              class="testimonial-image"
              src="https://th.bing.com/th/id/OIP.P5AxzXq-SHXftXPPF1D6tgHaJ4?rs=1&pid=ImgDetMain"
            />
            <p>
              "I had an incredible experience here. The facilities are
              top-notch, and the college fosters a culture of innovation and
              excellence. I'm proud to be an alumna!"
            </p>
            <h5 class="mb-0"><strong>Priya Sharma</strong></h5>
            <p class="text-muted">MBA, Marketing</p>
            <div class="stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <div class="quote-icon-right">
              <i class="fas fa-quote-right fa-2x text-white"></i>
            </div>
          </div>
        </div>

        <div class="testimonial-slide">
          <div class="testimonial-card">
            <div class="quote-icon">
              <i class="fas fa-quote-left fa-2x"></i>
            </div>
            <img
              alt="Portrait of a person"
              class="testimonial-image"
              src="https://th.bing.com/th/id/R.5e17860f56449aa49b86f08b3ceb6138?rik=tZFtUfuwfxuOPA&riu=http%3a%2f%2fwww.theeasyconcepts.com%2fwp-content%2fuploads%2f2017%2f11%2fzoom.jpg&ehk=SiAb0GAfxiyO8Y9iPf%2bGbee0oyzHUaDEer1dMqczaY8%3d&risl=&pid=ImgRaw&r=0"
            />
            <p>
              "The infrastructure and learning environment at this college are
              absolutely outstanding. It allowed me to grow as an individual and
              gain confidence in my skills."
            </p>
            <h5 class="mb-0"><strong>Ravi Deshmukh</strong></h5>
            <p class="text-muted">M.Sc, Environmental Science</p>
            <div class="stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <div class="quote-icon-right">
              <i class="fas fa-quote-right fa-2x text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Testimonials
