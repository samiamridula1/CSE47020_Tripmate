import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllExperiences, deleteExperience } from "../api/experienceApi";
import { useNotification } from "../components/Notification";
import SearchBar from "../components/SearchBar";
import ExperienceGrid from "../components/ExperienceGrid";

export default function AllExperiences() {
  const { showSuccess, showError } = useNotification();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "mine", "others"
  const [searchTerm, setSearchTerm] = useState("");

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
      showSuccess("Experience deleted successfully!");
    } catch (err) {
      console.error("Failed to delete experience:", err);
      showError("Failed to delete experience. Please try again.");
    }
  };

  // Sort by createdAt descending (newest first)
  const sortedExperiences = [...experiences].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const filteredExperiences = sortedExperiences.filter(exp => {
    if (!exp) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesLocation = exp.location?.toLowerCase().includes(searchLower);
      const matchesStory = exp.story?.toLowerCase().includes(searchLower);
      if (!matchesLocation && !matchesStory) return false;
    }
    
    // User filter
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

        {/* Filter Tabs and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              All ({sortedExperiences.length})
            </button>
            <button
              onClick={() => setFilter("mine")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "mine"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => setFilter("others")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === "others"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Community
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="w-full sm:w-80">
            <SearchBar 
              onSearch={setSearchTerm} 
              placeholder="Search by location or story..."
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredExperiences.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {searchTerm ? "No experiences found" : "No experiences yet"}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? `No experiences match "${searchTerm}"` : "Be the first to share your travel story!"}
          </p>
        </div>
      ) : (
        <ExperienceGrid
          title=""
          experiences={filteredExperiences}
          currentUserId={currentUser?._id || currentUser?.id}
          onDelete={handleDeleteExperience}
          showDelete={true}
          showOwner={true}
          emptyText="No experiences found"
          gridCols="md:grid-cols-2 lg:grid-cols-3"
        />
      )}
    </div>
  );
}