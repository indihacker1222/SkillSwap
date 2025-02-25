import React, { useState, useEffect } from "react";
import "../css/userProfile.css";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { NFTMARKETPLACEADDRESS, NFTMARKETPLACEABI } from "../Config/config";

const UserProfilePage = () => {
  const [userCourses, setUserCourses] = useState([]); // State to hold user's courses
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [resellingCourseId, setResellingCourseId] = useState(null); // Track course being resold

  const { address } = useAccount(); // Get user's wallet address
  const { writeContractAsync } = useWriteContract(); // For reselling courses

  const {
    data: myCourseData,
    isError: myCourseError,
    isLoading: myCourseLoading,
  } = useReadContract({
    address: NFTMARKETPLACEADDRESS,
    abi: NFTMARKETPLACEABI,
    functionName: "getMyCourses", // Assuming a function that fetches the courses owned by the user
    args: [address],
  });

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!myCourseData || myCourseError) {
        setError("Failed to fetch your courses. Please try again.");
        toast.error("Failed to fetch your courses.");
        return;
      }

      try {
        setIsLoading(true); // Start loading
        const parsedCourses = await Promise.all(
          myCourseData.map(async (course) => ({
            courseId: course.courseId.toString(),
            owner: course.owner,
            seller: course.seller,
            price: ethers.utils.formatEther(course.price),
            name: course.name || "Unknown Course",
            description: course.description || "No description available",
            image: course.courseURI || "/placeholder.png", // Fallback image
          }))
        );

        setUserCourses(parsedCourses); // Update state with parsed courses
        setIsLoading(false); // Stop loading
      } catch (err) {
        console.error("Error fetching user courses:", err);
        setError("Failed to load course metadata. Please try again.");
        toast.error("Failed to load course metadata.");
        setIsLoading(false); // Stop loading
      }
    };

    if (myCourseData) {
      fetchUserCourses();
    }
  }, [myCourseData, myCourseError]);

  const handleResell = async (courseId, price) => {
    setResellingCourseId(courseId); // Set the courseId being resold
    try {
      const priceInWei = ethers.utils.parseEther(price.toString());
      const transaction = await writeContractAsync({
        address: NFTMARKETPLACEADDRESS,
        abi: NFTMARKETPLACEABI,
        functionName: "resellCourse",
        args: [courseId, priceInWei],
      });

      if (transaction) {
        toast.success("Course listed for resale successfully!");
        const updatedCourses = userCourses.map((course) =>
          course.courseId === courseId
            ? { ...course, currentlyListed: true, price: price }
            : course
        );
        setUserCourses(updatedCourses); // Update courses list locally
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error reselling course:", error);
      toast.error("Failed to resell the course.");
    } finally {
      setResellingCourseId(null); // Reset reselling state
    }
  };

  return (
    <div className="profile-container">
      <h2 className="text-3xl font-bold text-center my-8">Your Profile</h2>
      <div>
        <h3 className="text-xl font-semibold my-4">Your NFTs</h3>
        {isLoading && <p className="text-center">Loading your courses...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="nft-grid">
          {userCourses.length > 0
            ? userCourses.map((course, index) => (
                <div key={index} className="nft-card">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="nft-card-image"
                    onError={(e) => (e.target.src = "/placeholder.png")} // Fallback image
                  />
                  <div className="nft-details">
                    <h3 className="nft-title">{course.name}</h3>
                    <p className="nft-description">{course.description}</p>
                    <p className="nft-price">Price: {course.price} CETH</p>
                    <p className="nft-owner">Seller: {course.seller}</p>
                    {course.currentlyListed ? (
                      <p className="nft-status">Currently Listed</p>
                    ) : (
                      course.owner === address &&
                      !course.currentlyListed && (
                        <button
                          className="resell-button"
                          onClick={() =>
                            handleResell(course.courseId, course.price)
                          }
                          disabled={resellingCourseId === course.courseId}
                        >
                          {resellingCourseId === course.courseId
                            ? "Processing..."
                            : "Resell NFT"}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))
            : !isLoading && (
                <p className="text-center">No courses found in your wallet.</p>
              )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
