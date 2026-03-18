import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import EmailPreview from "./pages/EmailPreview";
import Success from "./pages/Success";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/email-preview" element={<EmailPreview />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </>
  );
};

export default App;