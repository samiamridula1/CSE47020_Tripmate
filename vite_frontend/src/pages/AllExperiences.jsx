import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllExperiences, deleteExperience } from "../api/experienceApi.js";

export default function AllExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "mine", "others"

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = storedUser;

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await getAllExperiences();
      setExperiences(data);
    } catch (err) {
      console.error("Failed to fetch experiences:", err);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      const userId = currentUser._id || currentUser.id;
      await deleteExperience(experienceId, userId);
      fetchExperiences();
    } catch (err) {
      console.error("Failed to delete experience:", err);
      alert("Failed to delete experience. Please try again.");
    }
  };

  // Sort by createdAt descending (newest first)
  const sortedExperiences = [...experiences].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const filteredExperiences = sortedExperiences.filter(exp => {
    if (!exp) return false;
    // Handle both populated (object) and non-populated (string) userId
    const expUserId = typeof exp.userId === 'object' && exp.userId ? exp.userId._id : exp.userId;
    const currentUserId = currentUser?._id || currentUser?.id;
    if (filter === "mine") return expUserId && currentUserId && expUserId === currentUserId;
    if (filter === "others") return expUserId && currentUserId && expUserId !== currentUserId;
    return true; // "all"
  });

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Travel Experiences</h1>
            <p className="text-gray-600 mt-2">Discover amazing travel stories from our community</p>
          </div>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            All Experiences ({experiences.length})
          </button>
          <button
            onClick={() => setFilter("mine")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "mine"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            My Experiences ({experiences.filter(exp => {
              if (!exp) return false;
              const expUserId = typeof exp.userId === 'object' && exp.userId ? exp.userId._id : exp.userId;
              const currentUserId = currentUser?._id || currentUser?.id;
              return expUserId && currentUserId && expUserId === currentUserId;
            }).length})
          </button>
          <button
            onClick={() => setFilter("others")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === "others"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Others' Experiences ({experiences.filter(exp => {
              if (!exp) return false;
              const expUserId = typeof exp.userId === 'object' && exp.userId ? exp.userId._id : exp.userId;
              const currentUserId = currentUser?._id || currentUser?.id;
              return expUserId && currentUserId && expUserId !== currentUserId;
            }).length})
          </button>
        </div>
      </div>

      {/* Experiences Grid */}
      {filteredExperiences.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No experiences found</h3>
          <p className="text-gray-500">
            {filter === "mine" 
              ? "You haven't shared any experiences yet." 
              : filter === "others"
              ? "No one else has shared experiences yet."
              : "No experiences have been shared yet."
            }
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Share Your First Experience
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => {
            if (!exp) return null;
            const expUserId = typeof exp.userId === 'object' && exp.userId ? exp.userId._id : exp.userId;
            const currentUserId = currentUser?._id || currentUser?.id;
            const isMyExperience = expUserId && currentUserId && expUserId === currentUserId;
            return (
              <div key={exp._id || Math.random()} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <Link to={`/experience/${exp._id}`}>
                    <img
                      src={exp.imageUrl}
                      alt={exp.location}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isMyExperience 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {isMyExperience ? "My Experience" : "Community"}
                    </span>
                    {isMyExperience && (
                      <button
                        onClick={() => handleDeleteExperience(exp._id)}
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/experience/${exp._id}`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                      {exp.location}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {exp.story?.substring(0, 120) || ''}...
                    </p>
                  </Link>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {isMyExperience ? "By you" : `By ${typeof exp.userId === 'object' && exp.userId ? (exp.userId.name || exp.userId.email || "Anonymous") : "Anonymous"}`}
                    </p>
                    <Link
                      to={`/experience/${exp._id}`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
