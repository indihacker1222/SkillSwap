import React from "react";
import "../css/nftCard.css";

const NFTCard = ({ course, onBuy, isBuying }) => {
  return (
    <div className="nft-card-unique">
      <img
        src={course.image}
        alt={course.name}
        className="nft-card-unique-image"
        onError={(e) => (e.target.src = "/placeholder.png")} // Handle broken image
      />
      <div className="nft-card-unique-details">
        <h3 className="nft-card-unique-title">{course.name}</h3>
        <p className="nft-card-unique-description">{course.description}</p>
        <p className="nft-card-unique-price">Price: {course.price} CETH</p>
        <p className="nft-card-unique-owner">Seller: {course.seller}</p>

        {course.isBought ? (
          <p
            className="nft-card-unique-status"
            style={{ textAlign: "center", width: "100%" }}
          >
            sold
          </p>
        ) : course.currentlyListed ? (
          <p
            className="nft-card-unique-status"
            style={{ textAlign: "center", width: "100%" }}
          >
            Currently Listed
          </p>
        ) : null}

        <button
          onClick={onBuy}
          className="nft-card-unique-button"
          disabled={isBuying || course.isBought || !course.currentlyListed}
        >
          {isBuying
            ? "Processing..."
            : course.isBought
            ? "Already Bought"
            : "Buy NFT"}
        </button>
      </div>
    </div>
  );
};

export default NFTCard;
