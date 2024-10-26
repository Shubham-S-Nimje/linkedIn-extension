import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";
// import MainComponent from "./components/MainComponent";

function App() {
  return (
    <>
      {/* <MainComponent /> */}
      <div className="flex justify-center items-center">
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <p className="read-the-docs">Linkedin extension for chrome</p>
    </>
  );
}

export default App;
