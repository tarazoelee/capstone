import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // state = {
  //   data: null,
  // };

  // componentDidMount() {
  //   this.callBackendAPI()
  //     .then((res) => this.setState({ data: res.express }))
  //     .catch((err) => console.log(err));
  // }

  // // fetching the GET route from the Express server which matches the GET route from server.js
  // callBackendAPI = async () => {
  //   const response = await fetch("/express_backend");
  //   const body = await response.json();

  //   if (response.status !== 200) {
  //     throw Error(body.message);
  //   }
  //   return body;
  // };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
