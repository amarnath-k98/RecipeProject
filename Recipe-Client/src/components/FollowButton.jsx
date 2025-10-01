import React, { useState, useEffect } from "react";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "../slices/apiSlice";

const FollowButton = ({
  targetId,
  isFollowing: initialFollowStatus,
  onFollowSuccess,
  onUnfollowSuccess,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowStatus);

  const [followUser, { isLoading: loadingFollow }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: loadingUnfollow }] =
    useUnfollowUserMutation();

  const isLoading = loadingFollow || loadingUnfollow;

  useEffect(() => {
    setIsFollowing(initialFollowStatus);
  }, [initialFollowStatus]);

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(targetId).unwrap();
        setIsFollowing(false); 
        onUnfollowSuccess?.();
      } else {
        await followUser(targetId).unwrap();
        setIsFollowing(true); 
        onFollowSuccess?.();
      }
    } catch (err) {
      console.error("Follow/Unfollow failed:", err);
      const msg = err?.data?.message;

      if (msg === "Already following this user") {
        setIsFollowing(true);
        onFollowSuccess?.();
      } else if (msg === "You are not following this user") {
        setIsFollowing(false); 
        onUnfollowSuccess?.();
      }

      alert(msg || "Action failed");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-4 py-2 rounded text-sm sm:text-base font-medium transition-colors ${
        isFollowing
          ? "bg-gray-600 text-gray-200 hover:bg-gray-400"
          : "bg-gray-600 text-white hover:bg-gray-700"
      }`}
    >
      {isLoading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
