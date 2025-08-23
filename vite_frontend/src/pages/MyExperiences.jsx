import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllExperiences, deleteExperience } from "../api/experienceApi.js";
import ShareExperienceModal from "../components/ShareExperienceModal";
import EditExperienceModal from "../components/EditExperienceModal";

export default function MyExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = storedUser;

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await getAllExperiences();
      // Robust filter to show only current user's experiences (with null checks)
      const myExperiences = data.filter(exp => {
        if (!exp) return false;
        const expUserId = typeof exp.userId === 'object' && exp.userId ? exp.userId._id : exp.userId;
        const currentUserId = currentUser?._id || currentUser?.id;
        return expUserId && currentUserId && expUserId === currentUserId;
      });
  // Sort by createdAt descending (newest first)
  myExperiences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  setExperiences(myExperiences);
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

  const refreshExperiences = () => {
    fetchExperiences();
    setShowModal(false);
    setEditingExperience(null);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your experiences...</p>
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
            <h1 className="text-3xl font-bold text-gray-800">My Travel Experiences</h1>
            <p className="text-gray-600 mt-2">Personal collection of my travel memories</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <Link
              to="/all-experiences"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              All Experiences
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              + Share New Experience
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{experiences.length}</div>
              <div className="text-sm text-gray-600">Total Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {experiences.reduce((total, exp) => total + (exp.story ? exp.story.trim().split(/\s+/).length : 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Words Written</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(experiences.map(exp => exp.location)).size}
              </div>
              <div className="text-sm text-gray-600">Unique Destinations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Experience Modal */}
      {showModal && (
        <ShareExperienceModal
          userId={currentUser._id}
          onClose={() => setShowModal(false)}
          onUploadSuccess={refreshExperiences}
        />
      )}

      {/* Edit Experience Modal */}
      {editingExperience && (
        <EditExperienceModal
          experience={editingExperience}
          onClose={() => setEditingExperience(null)}
          onUpdateSuccess={refreshExperiences}
        />
      )}

      {/* Experiences Grid */}
      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📷</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No experiences yet</h3>
          <p className="text-gray-500 mb-6">
            Start sharing your travel memories and build your personal collection!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Share Your First Experience
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <Link to={`/experience/${exp._id}`}>
                  <img
                    src={exp.imageUrl}
                    alt={exp.location}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    My Experience
                  </span>
                  <button
                    onClick={() => setEditingExperience(exp)}
                    className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteExperience(exp._id)}
                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <Link to={`/experience/${exp._id}`}>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                    {exp.location}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {exp.story.substring(0, 120)}...
                  </p>
                </Link>
                
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {new Date(exp.createdAt).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/experience/${exp._id}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    Read Full Story →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add floating action button for mobile */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors md:hidden"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
