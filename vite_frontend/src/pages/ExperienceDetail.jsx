import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAllExperiences, deleteExperience } from "../api/experienceApi.js";
import EditExperienceModal from "../components/EditExperienceModal";
import Comments from "../components/Comments";

export default function ExperienceDetail() {
  const [editing, setEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = storedUser;

  useEffect(() => {
    fetchExperience();
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const data = await getAllExperiences();
      const foundExperience = data.find(exp => exp._id === id);
      
      if (!foundExperience) {
        setError("Experience not found");
      } else {
        setExperience(foundExperience);
      }
    } catch (err) {
      console.error("Failed to fetch experience:", err);
      setError("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async () => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      const userId = currentUser._id || currentUser.id;
      await deleteExperience(experience._id, userId);
      navigate("/my-experiences");
    } catch (err) {
      console.error("Failed to delete experience:", err);
      alert("Failed to delete experience. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">{error || "Experience not found"}</h2>
          <p className="text-gray-500 mb-6">The experience you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/all-experiences"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Experiences
          </Link>
        </div>
      </div>
    );
  }

  const expUserId = typeof experience.userId === 'object' && experience.userId ? experience.userId._id : experience.userId;
  const currentUserId = currentUser?._id || currentUser?.id;
  const isMyExperience = expUserId && currentUserId && expUserId === currentUserId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Edit Experience Modal */}
      {editing && (
        <EditExperienceModal
          experience={experience}
          onClose={() => setEditing(false)}
          onUpdateSuccess={() => {
            setEditing(false);
            fetchExperience();
          }}
        />
      )}
      {/* Header Image */}
      <div className="relative h-120 overflow-hidden">
        <img
          src={experience.imageUrl}
          alt={experience.location}
          className="w-full h-full object-cover"
          style={{ display: 'block', margin: '0 auto' }}
        />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          {isMyExperience && (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="bg-yellow-500 bg-opacity-90 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h.01M12 15h.01M9 12h.01M12 9h.01M12 3v2m0 14v2m9-9h-2M5 12H3" />
                </svg>
                Edit
              </button>
              <button
                onClick={handleDeleteExperience}
                className="bg-red-500 bg-opacity-90 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white bg-opacity-95 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{experience.location}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isMyExperience 
                  ? "bg-green-100 text-green-800" 
                  : "bg-blue-100 text-blue-800"
              }`}>
                {isMyExperience ? "My Experience" : "Community Post"}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>By {isMyExperience ? "you" : (typeof experience.userId === 'object' && experience.userId ? (experience.userId.name || experience.userId.email || "Anonymous") : "Anonymous")}</span>
              <span>•</span>
              <span>{new Date(experience.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Story Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
              {experience.story}
            </div>
          </div>

          {/* Comments Section */}
          <Comments 
            experienceId={experience._id} 
            currentUserId={currentUserId} 
          />

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
            <div className="text-sm text-gray-500">
              Added {new Date(experience.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/all-experiences"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  ← Browse More Experiences
                </Link>
                {isMyExperience && (
                  <Link
                    to="/my-experiences"
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    View My Other Experiences
                  </Link>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <button className="text-gray-600 hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button className="text-gray-600 hover:text-blue-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Experiences */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">More Travel Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* This would be populated with related experiences */}
            <div className="text-center py-8 text-gray-500">
              <p>Related experiences coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
