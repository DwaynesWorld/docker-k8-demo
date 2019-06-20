import React from "react";
import RealTimeChart from "./RTChart";
import styled from "styled-components";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Container>
        <RealTimeChart />
      </Container>
    </div>
  );
};

const Container = styled.div`
  margin: 25px;
`;

export default App;
