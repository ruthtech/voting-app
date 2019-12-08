import React, { useState, useEffect } from "react";
import axios from "axios";
import Seed from "./component/seed.js";
import "./App.css";

function App() {
  const [test, setTest] = useState("default");

  async function loadVoters() {
    let response = await axios.get(
      "https://randomuser.me/api/?results=5000&nat=CA"
    );
    console.log("Server called", response);
  }
  // async function fetchAdvice() {
  //   try {
  //     let response = await axios.get("/api/test");
  //     // console.log(response);
  //     setTest(response.data.message);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  useEffect(() => {
    // called setState only to trigger this method
    loadVoters();
    // fetchAdvice();
  }, []);

  return (
    <div className="App">
      <Seed />
      <p>Test is: {test}</p>
      <p>This is another test.</p>
    </div>
  );
}

export default App;
