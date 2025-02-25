import React, { useEffect, useState } from "react";
import { pinata } from "../utils/config"; // Assuming you have a pinata configuration
import "../css/createNftPage.css"; // Import your CSS file
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { NFTMARKETPLACEABI, NFTMARKETPLACEADDRESS } from "../Config/config";

const CreateNFTPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [listPrice, setListPrice] = useState(null);

  const { writeContractAsync, isPending } = useWriteContract();
  const { address } = useAccount();

  // Handle file selection
  const changeHandler = (event) => {
    const file = event.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const { data, isError } = useReadContract({
    address: NFTMARKETPLACEADDRESS,
    abi: NFTMARKETPLACEABI,
    functionName: "getListPrice",
  });

  useEffect(() => {
    const fetchListPrice = async () => {
      if (data) {
        try {
          // Convert BigNumber to Ether (format as a string)
          const formattedPrice = ethers.utils.formatEther(data);
          setListPrice(formattedPrice);
        } catch (error) {
          console.error("Error fetching listPrice:", error);
        }
      }
    };

    if (data) {
      fetchListPrice();
    }
  }, [data]);

  // Upload file to Pinata and get IPFS URLL
  const handleSubmission = async () => {
    if (!selectedFile) return alert("Please select a file!");

    try {
      // Upload the file to Pinata
      const upload = await pinata.upload.file(selectedFile);
      console.log(upload); // Log the upload response
      const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash); // Convert to IPFS URL
      setImage(ipfsUrl); // Set the image URL to state
    } catch (error) {
      console.log("Error uploading to Pinata: ", error);
    }
  };

  // Handle NFT creation
  const handleCreateNFT = async () => {
    if (!image || !name || !price || !description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // Prepare the token URI for the IPFS image URL
      const tokenURI = image; // The IPFS URL for the image

      // Make sure the price is a valid number
      if (isNaN(price) || price <= 0) {
        toast.error("Please provide a valid price");
        return;
      }

      // Convert price to the appropriate format (e.g., Wei)
      const priceInWei = ethers.utils.parseEther(price.toString()); // Converts price to Wei
      const listpriceInWei = ethers.utils.parseEther(listPrice.toString());

      const transaction = await writeContractAsync({
        address: NFTMARKETPLACEADDRESS,
        abi: NFTMARKETPLACEABI,
        functionName: "createCourse",
        args: [name, tokenURI, priceInWei, description],
        value: listpriceInWei, // This sends the list price as Ether
      });

      if (transaction) {
        toast.success("Educational Resource Created Successfully");

        setImage(null);
        setName("");
        setSelectedFile(null);
        setPrice("");
        setDescription("");
      } else {
        toast.error("Creation Failed!");
      }
    } catch (error) {
      console.log("Error creating educational resource: ", error);

      // Handle different error types
      if (error.message.includes("Send enough ether to list")) {
        toast.error(
          "Not enough Ether to list the course. Please make sure you send the correct amount."
        );
      } else if (error.message.includes("Make sure the price isn't negative")) {
        toast.error("Invalid price. The price must be greater than zero.");
      } else if (error.message.includes("revert")) {
        toast.error(
          "Transaction failed. Please check your inputs or contract state."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="create-nft-page">
      <div className="create-nft-container">
        <h2>Create Your Educational NFT</h2>
        <label className="form-label">Choose File</label>
        <input type="file" onChange={changeHandler} />
        <button onClick={handleSubmission} style={{ marginBottom: "15px" }}>
          Upload Image
        </button>

        {image && <img src={image} alt="Preview" className="image-preview" />}

        <input
          type="text"
          placeholder="Course Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price (CETH)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onInput={(e) => {
            const value = e.target.value;
            if (value < 0) e.target.value = ""; // Clear the input if it's negative
          }}
        />

        <button onClick={handleCreateNFT}>Create Course</button>
      </div>
    </div>
  );
};

export default CreateNFTPage;
