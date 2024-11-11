import './styles.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then((response) => setMessage(response.data))
      .catch((error) => console.log('Error fetching data:', error));
  }, []);

  return (
    <div>
      <p>Message: {message}</p>
    </div>
  );
}

export default App;