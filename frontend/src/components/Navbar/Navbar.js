import React from "react";
import Header from '../header/Header';
import "./Marquee.jsx"
import Marquee from "./Marquee.jsx";
export default function Navbar(props) {
  const [scroll, setScroll] = React.useState(0);

  const handleScroll = () => setScroll(document.documentElement.scrollTop);

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  setInterval(() => {
    fetch("https://collegeform.onrender.com/ping")
      .catch(err => console.error("Keep-alive failed:", err));
  }, 45000); // Pings every 45 seconds
  

  const className = scroll > 80 ? "fixed-navbar active" : "fixed-navbar";

  return (
    <>
    
    <div className={className}>
       
        <Header hclass={props.hclass} Logo={props.Logo} topbarClass={props.topbarClass} />
    </div>
    </>

  ); 
}