import React, { useEffect, useState } from "react";
import {
  useGetProfileQuery,
  useGetUserDashboardQuery,
  useUpdateProfileMutation,
} from "../slices/apiSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import ImageUpload from "../components/ImageUpload";

const ProfileEdit = () => {
  const { data, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { refetch } = useGetUserDashboardQuery();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      refetch();
      navigate("/dashboard");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update profile.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  if (isLoading) return <Loading message="Loading Profile..." />;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load profile.
      </div>
    );

  return (
    <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Edit Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-400 shadow-gray-600 shadow-md rounded-lg p-4 sm:p-6 space-y-6"
      >
        <div className="form-section">
          <label className="block text-sm sm:text-base font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
          />
        </div>

        <div className="form-section">
          <label className="block text-sm sm:text-base font-medium mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
          />
        </div>

        <div className="form-section">
          <label className="block text-sm sm:text-base font-medium mb-1">
            Profile Picture
          </label>
          <ImageUpload
            value={formData.avatar}
            onChange={(url) =>
              setFormData((prev) => ({
                ...prev,
                avatar: url,
              }))
            }
          />
        </div>

        <div className="form-actions flex gap-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
          >
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
