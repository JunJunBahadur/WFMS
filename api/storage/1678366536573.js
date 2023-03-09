import React, { useState, useEffect } from "react";
import Axios from "axios";

function Home() {
    const [message, setMessage] = useState("");

    let storage = Object.keys(sessionStorage)
    let key = storage[2]
    const result = JSON.parse(sessionStorage.getItem(key));
    let email = result['username']
    let name = result['name']

    useEffect(() => {
      fetch("http://localhost:8000/message")
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
    }, []);

    function handleClick() {
      Axios.post("http://localhost:8000/payment", {
        name: name,
        email: email
      })
    }
    return (
      <div className="Home">
        <h1>{message}</h1>
        <p>Welcome, {name}</p>
        <button onClick={handleClick}>Click me</button>
      </div>
    );
  }


export default Home