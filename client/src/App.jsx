// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import NFTListPage from "./components/NFTListPage.jsx";
import CreateNFTPage from "./components/CreateNFTPage.jsx";
import UserProfilePage from "./components/UserProfile.jsx";
import NotFoundPage from "./components/NotFound.jsx";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<NFTListPage />} />
        <Route path="/create" element={<CreateNFTPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
