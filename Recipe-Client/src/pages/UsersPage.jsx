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
        <div className="max-w-md mx-auto flex flex-col justify-center items-center bg-gray-300 rounded-lg shadow-lg shadow-gray-500  px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <h2 className="text-2xl font-bold">Users Like You</h2>

          <input
            type="text"
            placeholder="Search users by name or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2 border border-gray-400 rounded-md shadow-lg shadow-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {isLoading ? (
            <Loading message="Loading users..." />
          ) : filteredUsers.length > 0 ? (
            <div className="flex flex-col  sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-100 shadow-md shadow-gray-500 rounded-lg p-4 flex items-center gap-4"
                >
                  <img
                    src={user.avatar || Dummy_Person}
                    alt={user.name}
                    onError={(e) => {
                      e.target.src = Dummy_Person;
                    }}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">
                      {user.bio || "No bio yet."}
                    </p>
                  </div>
                  <div className="mt-2">
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
