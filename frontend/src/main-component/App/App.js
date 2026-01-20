import React from 'react';
import AllRoute from '../router'
// import {ToastContainer} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import FloatingButtons from "../../components/FloatingButtons";


const App = () => { 

  return (
    <div className="App" id='scrool'>
    <FloatingButtons />
          <AllRoute/>
          {/* <ToastContainer/> */}
    </div>
  );
}

export default App;
