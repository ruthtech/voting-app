import React, { useEffect } from 'react';
import axios from "axios";

function Seed() {
  useEffect(() => {
    console.log("Server called");
    loadVoters();
  }, []);

  const loadVoters = async () => {
    let response = await axios.get(
      "https://randomuser.me/api/?results=5000&nat=CA"
    );
    console.log("Server called", response);
  }

  return (
    <div>
      
    </div>
  );
}

export default Seed;
