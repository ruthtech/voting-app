import React from "react";
import axios from 'axios';

import LoginForm from "./LoginForm";

function Login(props) {
  const handleFormSubmit = async (uuid, password, event) => {
    try {
      event.preventDefault();
      uuid = escape(uuid);
      // console.log(`login with  ${uuid} ${password} is verified?`);
      let query = `/api/login/${uuid}/${password}`;
      const user = await axios.get(query);
      console.log("Login.js login with uuid " + uuid + " found the following user ");
      console.log(user);
      if(user === []) {
        // User not found.
        // Stay on this page until a correct uuid and password is entered.
        // TODO Show error message to user
      } else {
        props.handleValidate(user.data[0]);

        // Redirect the user to the landing page
        props.history.push({
          pathname: "/landing",
          user: {details: user}
        });
      }
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
