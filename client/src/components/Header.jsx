import React from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "../css/Header.css";
import logo from "../assets/SkillSwap.png";

const Header = () => {
  return (
    <header className="header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="EduVerse Logo" className="logo" style={{borderRadius: "50%", marginRight: "4px"}}/>{" "}
        <h1 className="logo" style={{ marginBottom: "7px"}}>
          SkillSwap
        </h1>
      </div>
      <div className="nav-links" style={{ alignItems: "center" }}>
        <Link to="/" className="nav-item">
          Home
        </Link>
        <Link to="/create" className="nav-item">
          Create NFT
        </Link>
        <Link to="/profile" className="nav-item">
          Profile
        </Link>
        <div style={{ marginRight: "40px" }}>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
