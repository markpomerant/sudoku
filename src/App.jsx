import './App.css';
import React, { useState, useEffect } from "react";
import SudokuBoard from "./components/sudoku-board";

function App() {
  return (
    <div className="App">
      <SudokuBoard />
    </div>
  );
}

export default App;
