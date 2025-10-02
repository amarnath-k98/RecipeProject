import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAllUsersQuery,
  useGetProfileQuery,
  useDeleteAccountMutation,
} from "../slices/apiSlice";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { clearUser } from "../slices/authSlice";
import Dummy_Person from "../assets/Dummy_Person.jpg";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: allUsersData, isLoading, isError } = useGetAllUsersQuery();
  const { data: profileData, refetch: refetchProfile } = useGetProfileQuery();
  const [deleteAccount] = useDeleteAccountMutation();
  const dispatch = useDispatch();

  const users = allUsersData?.users || [];
  const currentUser = profileData?.user;
  const currentUserId = currentUser?._id;

  const user = useMemo(() => {
    return id ? users.find((u) => u._id === id) : currentUser;
  }, [id, users, currentUser]);

  if (isLoading) return <Loading message="Loading profile..." />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load profile.
      </div>
    );
  if (!user)
    return (
      <div className="text-center py-10 text-gray-500">User not found.</div>
    );

  const isOwnProfile = user._id === currentUserId;

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await deleteAccount().unwrap();
      dispatch(clearUser());
      alert("Account deleted successfully.");
      navigate("/login");
    } catch (err) {
      console.error("Account deletion failed:", err);
      alert(err?.data?.message || err?.message || "Failed to delete account.");
    }
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-6">
      <div className="bg-gray-300 shadow-gray-500 shadow-md rounded-lg p-6 space-y-4">
        <section className="bg-gray-400 shadow-md shadow-gray-600 rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Profile</h2>
          {user.avatar && (
            <div className="flex justify-center mb-4">
              <img
                src={user.avatar || Dummy_Person}
                alt={`${user.name}'s avatar`}
                onError={(e) => {
                  e.target.src = Dummy_Person;
                }}
                className="w-24 h-24 rounded-full object-cover border"
              />
            </div>
          )}
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Name:</span>{" "}
              <span>{user.name || "No name provided"}</span>
            </div>
            <div>
              <span className="font-semibold">Email:</span>{" "}
              <span>{user.email || "Not provided"}</span>
            </div>
            <div>
              <span className="font-semibold">Bio:</span>{" "}
              <span>{user.bio || "No bio added yet."}</span>
            </div>
            {isOwnProfile && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm sm:text-base"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm sm:text-base"
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
