import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import Login from "./Login";

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
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}

export default App;
