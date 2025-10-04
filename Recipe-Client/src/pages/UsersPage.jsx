import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllUsersQuery, useGetProfileQuery } from "../slices/apiSlice";
import Loading from "../components/Loading";
import FollowButton from "../components/FollowButton";
import Dummy_Person from "../assets/Dummy_Person.jpg";

const UsersPage = () => {
  const { data: userData, isLoading } = useGetAllUsersQuery();
  const { data: profileData, refetch } = useGetProfileQuery();
  const currentUserId = useSelector((state) => state.auth.user?._id);
  const users = userData?.users || [];
  const currentUserFollowing = profileData?.user?.following || [];

    const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users
    .filter((user) => user._id !== currentUserId)
    .filter((user) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(lowerSearch) ||
        (user.bio && user.bio.toLowerCase().includes(lowerSearch))
      );
    });

    return (
      <div className=" px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto bg-gray-300 rounded-lg shadow-lg shadow-gray-500 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">Users Like You</h2>

          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search users by name or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 border border-gray-400 rounded-md shadow-lg shadow-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {isLoading ? (
            <Loading message="Loading users..." />
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col items-center text-center"
                >
                  <img
                    src={user.avatar || Dummy_Person}
                    alt={user.name}
                    onError={(e) => {
                      e.target.src = Dummy_Person;
                    }}
                    className="w-16 h-16 rounded-full object-cover mb-2"
                  />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600 break-words">
                      {user.bio || "No bio yet."}
                    </p>
                  </div>
                  <div className="mt-4 w-full">
                    <FollowButton
                      targetId={user._id}
                      isFollowing={user.isFollowing}
                      onFollowSuccess={refetch}
                      onUnfollowSuccess={refetch}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No users found.</p>
          )}
        </div>
      </div>
    );
};

export default UsersPage;
