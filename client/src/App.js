import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [test, setTest] = useState("default");

  async function fetchAdvice() {
    try {
      let response = await axios.get('/api/test');
      // console.log(response);
      setTest(response.data.message);
    } catch ( err ) {
      console.log(err);
    }
  }

  useEffect(() => {
    // called setState only to trigger this method
    fetchAdvice();
  }, []);

  return (
    <div className="App">
        <p>
          Test is: {test}
        </p>
        <p>
          This is another test.
        </p>
    </div>
  );
}

export default App;
