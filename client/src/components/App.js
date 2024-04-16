import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import CreateProfile from "./CreateProfile";
import ContactUs from "./ContactUs";
import ForgotPassword from "./ForgotPassword";

function App() {
  return (
    <div className="w-screen h-screen">
      <Router>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard></Dashboard>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route
              path="/createProfile"
              element={<CreateProfile></CreateProfile>}
            ></Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
