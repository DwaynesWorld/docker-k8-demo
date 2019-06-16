import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [polling, setPolling] = useState(true);
  const [prices, setPrices] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    if (polling) {
      timer.current = setInterval(() => getPrices(), 100);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [polling]);

  const clearTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  const getPrices = async () => {
    const results = await axios.get("http://localhost:81/api/values/50000");
    console.log(results);
    setPrices(results.data);
  };

  const togglePolling = () => {
    setPolling(!polling);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {prices.slice(0, 5).map(num => {
            return <h1>{num}</h1>;
          })}
        </div>
        <div>
          <button onClick={togglePolling}>{polling ? `Stop` : `Start`}</button>
        </div>
      </header>
    </div>
  );
};

export default App;
