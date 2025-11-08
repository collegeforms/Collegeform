import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import 'bootstrap/dist/css/bootstrap.min.css';

// ScrollToTop helper
import ScrollToTop from './ScrollToTop.js';

// Components
import Homepage from '../HomePage/HomePage';
import Collegespage from './components/Collegespage';
import Signup from './components/Signup';
import Bigform from './components/Bigform';
import Home from './components/Home';

// Admin Components
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminSettings from './admin/AdminSettings';
import AdminColleges from './admin/AdminColleges';
import AdminInquiry from './admin/AdminInquiry';
import Addbanner from './admin/Addbanner';
import AddLogo from './admin/Addlogo';
import Adminupload from './admin/Adminupload';
import Adminusers from './admin/Adminusers';
import AdminSpecialization from './admin/AdminSpecialization';
import Students from './admin/Adminapplications.jsx';
import AdminProtected from './admin/AdminProtected';
import AuthLogin from './admin/AdminLogin.jsx';
import Login from './components/Login.jsx';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Singlestudent from './admin/Singlestudent.jsx';
import PrivacyPage from '../PrivacyPage/PrivacyPage.js';
import Events from '../PrivacyPage/Events.js';
import ChangePassword from './components/ChangePassword.jsx';
import CourseSinglePage from '../CourseSinglePage/CourseSinglePage.js';
import TeamSinglePage from '../TeamSinglePage/TeamSinglePage.js';
import EditCollege from './admin/EditCollege.jsx';
import VideoCarousel from './components/VideoCarousel.jsx';
import AdminBlogs from './admin/AdminBlogs.jsx';
import TeamPage from '../TeamPage/TeamPage.js';
import BlogPageFullwidth from '../BlogPageFullwidth/BlogPageFullwidth.js';
import BlogPage from '../BlogPage/BlogPage.js';
import BlogDetails from '../BlogDetails/BlogDetails.js';
import StudyAbroad from '../HomePage/StudyAbroad.jsx';
import OtherColleges from './admin/OtherColleges.jsx';
import MyAccount from './components/Myaccount.jsx';
import SliderManager from './admin/SliderManager.jsx';
import ContactUs from './components/ContactUs.jsx';
import AdminExams from './admin/AdminExams.jsx';
import OffersPage from './components/Offer.jsx';
import AdminReviews from './admin/AdminReviews.jsx';
import AdminTests from './admin/AdminTests.jsx';
import StudentTests from './components/tests/StudentTests.js';
import Admindocs from './admin/Admindocs.jsx';
import FAQ from '../FaqPage/FAQ.js';
import Addfaq from './admin/Addfaq.jsx';
import Adminapplications from './admin/Adminapplications.jsx';
import CartPage from './components/CartPage.js';
import AddCollegePage from './admin/AddCollegePage.jsx';
import Privacy from './components/Privacy.jsx';
import Terms from './components/Terms.jsx';
import Educationloan from './components/Educationloan.jsx';
import Accommodation from './components/Accommodation.jsx';
import Requestcallback from './admin/Requestcallback.jsx';
import OverseasEducation from '../HomePage/OverseasEducation.jsx';
import CompetitiveExams from './components/CompetitiveExams.jsx';
import Admincourseexams from './admin/Admincourseexams.js';

const AllRoute = () => {
  const theme = createTheme();

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          {/* 🔝 ScrollToTop ensures every route opens from top */}
          <ScrollToTop />

          <Routes>

            {/* ===== Admin Routes ===== */}
            <Route
              path="/admin/*"
              element={
                <AdminProtected>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="colleges" element={<AdminColleges />} />

                      <Route path="other-colleges" element={<OtherColleges />} />
                      <Route path="addfaq" element={<Addfaq />} />
                      <Route path="inquiry" element={<AdminInquiry />} />
                      <Route path="addbanner" element={<Addbanner />} />
                      <Route path="addBlogs" element={<AdminBlogs />} />
                      <Route path="slidermanager" element={<SliderManager />} />
                      <Route path="addreview" element={<AdminReviews />} />
                      <Route path="addlogo" element={<AddLogo />} />
                      <Route path="upload" element={<Adminupload />} />
                      <Route path="users" element={<Adminusers />} />
                      <Route path="specialization" element={<AdminSpecialization />} />
                      <Route path="exams" element={<AdminExams />} />
                      <Route path="manage-exams" element={<Admincourseexams />} />

                      <Route path="tests" element={<AdminTests />} />
                      <Route path="verifydocs" element={<Admindocs />} />
                      <Route path="students" element={<Students />} />
                      <Route path="applications" element={<Adminapplications />} />
                      <Route path="/edit-college/:id" element={<EditCollege />} />
                      <Route path="/colleges/add" element={<AddCollegePage />} />

<Route path="/callbacks" element={<Requestcallback />} />
                    </Routes>
                  </AdminLayout>
                </AdminProtected>
              }
            />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AuthLogin />} />

            {/* ===== User Routes ===== */}
            <Route path="/" element={<Homepage />} />
            <Route path="/video" element={<VideoCarousel />} />
            <Route path="/myaccount" element={<MyAccount />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/education/education-loan" element={<Educationloan />} />
            <Route path="/education/accommodation" element={<Accommodation />} />
            <Route path="/CompetitiveExams" element={<CompetitiveExams />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/studyabroad" element={<PrivacyPage />} />
            <Route path="/events" element={<Events />} />
            <Route path="/students/tests" element={<StudentTests />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/old" element={<Home />} />
            <Route path="/colleges" element={<Collegespage />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route path="/user/reset-password/:token" element={<ResetPassword />} />
            <Route path="/user/signup" element={<Signup />} />
            <Route path="/offer" element={<OffersPage />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/step" element={<Bigform />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/education/:category" element={<OverseasEducation />} />
            <Route path="/college/:id?" element={<TeamSinglePage />} />
            <Route path="/blogs" element={<BlogPageFullwidth />} />
            <Route path="/blogs/:slug" element={<BlogDetails />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />


          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default AllRoute;
