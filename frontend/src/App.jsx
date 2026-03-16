import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import EmailPreview from "./pages/EmailPreview";
import Success from "./pages/Success";

const App = () => {
  return (
    <div className="text-4xl">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/email-preview" element={<EmailPreview />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
};

export default App;
