import React from "react";
import axios from 'axios';

import LoginForm from "./LoginForm";

function Login(props) {
  const handleFormSubmit = async (uuid, password, event) => {
    try {
      event.preventDefault();

      let query = `/api/${uuid}/${password}`;
      const user = await axios.get(query);
      // console.log(user);
      // console.log(`login with  ${uuid} ${password} is verified? ${user.data.isVerified}`);
      props.handleValidate(user);
    } catch ( err ) {
      console.log(err);
      props.handleValidate(false);
    }
  };

  return (
    <div className="full-screen">
      <div className="full-screen">
        <LoginForm 
          handleFormSubmit={handleFormSubmit}
        /> 
      </div>
    </div>
  );
}

export default Login;
