import React from "react";
import axios from "axios";

function Seed() {
  console.log("Server called");
  async function loadVoters() {
    let response = await axios.get(
      "https://randomuser.me/api/?results=5000&nat=CA"
    );
  }
}

export default Seed;
