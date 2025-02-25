import React, { useState, useEffect } from "react";
import NFTCard from "./NFTCard";
import "../css/nftListPage.css";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { NFTMARKETPLACEABI, NFTMARKETPLACEADDRESS } from "../Config/config";

const NFTListPage = () => {
  const [courses, setCourses] = useState([]); // State to hold the listed courses
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [buyingCourseId, setBuyingCourseId] = useState(null); // Tracks which course is being bought

  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  // Fetch all listed courses from the contract
  const { data: coursesData } = useReadContract({
    address: NFTMARKETPLACEADDRESS,
    abi: NFTMARKETPLACEABI,
    functionName: "getAllCourses",
  });

  useEffect(() => {
    const fetchCoursesMetadata = async () => {
      if (!coursesData || coursesData.length === 0) {
        setCourses([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const parsedCourses = await Promise.all(
          coursesData.map(async (course) => ({
            courseId: course.courseId.toString(),
            currentlyListed: course.currentlyListed,
            owner: course.owner,
            seller: course.seller,
            price: ethers.utils.formatEther(course.price), // Convert price to Ether
            name: course.name || "Unknown Course",
            description: course.description || "No description available",
            image: course.courseURI || "", // Assuming courseURI holds the image URL
          }))
        );

        setCourses(parsedCourses);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching course metadata:", err);
        setError("Failed to load courses metadata. Please try again.");
        setIsLoading(false);
        toast.error("Failed to load courses metadata. Please try again.");
      }
    };

    if (coursesData) {
      fetchCoursesMetadata();
    }
  }, [coursesData]);

  // Handle buying a course
  const handleBuyCourse = async (courseId, price) => {
    setBuyingCourseId(courseId); // Set the courseId being bought
    try {
      const priceInWei = ethers.utils.parseEther(price.toString());
      const transaction = await writeContractAsync({
        address: NFTMARKETPLACEADDRESS,
        abi: NFTMARKETPLACEABI,
        functionName: "executeSale", // Adjust if the function name differs
        args: [courseId],
        value: priceInWei, // Send the price in Ether
      });

      if (transaction) {
        toast.success("Course bought successfully!");
        const updatedCourses = courses.map((course) =>
          course.courseId === courseId
            ? { ...course, currentlyListed: false, owner: address }
            : course
        );
        setCourses(updatedCourses); // Update the courses list locally
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error buying course:", error);
      if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds.");
      } else if (error.code === "USER_REJECTED") {
        toast.warning("Transaction cancelled by user.");
      } else if (error.message.includes("revert")) {
        toast.error("Transaction failed: Contract reverted.");
      } else {
        toast.error("Failed to buy course.");
      }
    } finally {
      setBuyingCourseId(null); // Reset buying state
    }
  };

  return (
    <div className="nft-list-page">
      <div className="nft-list-container">
        <h2 className="text-3xl font-bold text-center my-8">
          Educational NFT Marketplace
        </h2>
        {isLoading && <p className="text-center">Loading courses...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="nft-grid">
          {courses.length > 0
            ? courses.map((course) => (
                <NFTCard
                  key={course.courseId}
                  course={course}
                  onBuy={() => handleBuyCourse(course.courseId, course.price)}
                  isBuying={buyingCourseId === course.courseId} // Check if the course is being bought
                />
              ))
            : !isLoading && <p className="text-center">No courses found.</p>}
        </div>
      </div>
    </div>
  );
};

export default NFTListPage;
