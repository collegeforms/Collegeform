import "./utils/browserSafe";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/main-component/App/App";
import reportWebVitals from "./reportWebVitals";
import { ParallaxProvider } from "react-scroll-parallax";
import { AuthProvider } from "./main-component/router/context/AuthContext";
import { CartProvider } from "./main-component/router/context/CartContext";
import { HelmetProvider } from "react-helmet-async";
import "./css/font-awesome.min.css";
import "./css/themify-icons.css";
import "./css/animate.css";
import "./css/flaticon.css";
import "./sass/style.scss";

const rootElement = document.getElementById("root");
const isReactSnap = navigator.userAgent === "ReactSnap";

const AppWrapper = () => (
  <HelmetProvider>
    <AuthProvider>
      <CartProvider>
        <ParallaxProvider>
          <App />
        </ParallaxProvider>
      </CartProvider>
    </AuthProvider>
  </HelmetProvider>
);

if (isReactSnap) {
  ReactDOM.hydrateRoot
    ? ReactDOM.hydrateRoot(rootElement, <AppWrapper />)
    : ReactDOM.render(<AppWrapper />, rootElement);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AppWrapper />);
}

reportWebVitals();