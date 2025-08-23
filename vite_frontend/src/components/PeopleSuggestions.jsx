import React, { useState, useEffect } from "react";
import "./PeopleSuggestions.css";
import { fetchSuggestions } from "../api/authApi";

const PeopleSuggestions = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPeopleSuggestions();
  }, []);

  const fetchPeopleSuggestions = async () => {
    try {
      setLoading(true);
      const data = await fetchSuggestions();
      setPeople(data);
    } catch (err) {
      console.error("Error fetching people suggestions:", err);
      setError("Failed to load suggestions");
      // Fallback to static data
      setPeople([
        {
          _id: 1,
          name: "Ayesha Rahman",
          interest: "Beach trips & photography",
          avatar: "/avatars/avatar1.png",
        },
        {
          _id: 2,
          name: "Tanvir Ahmed",
          interest: "Mountain hiking & camping",
          avatar: "/avatars/avatar2.png",
        },
        {
          _id: 3,
          name: "Nusrat Jahan",
          interest: "Tea gardens & nature walks",
          avatar: "/avatars/avatar3.png",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = (person) => {
    // TODO: Implement group creation functionality
    console.log("Creating group with:", person.name);
    alert(`Group creation with ${person.name} - Feature coming soon!`);
  };

  if (loading) {
    return (
      <div className="people-suggestions">
        <h2 className="people-title">Suggested People</h2>
        <p>Loading suggestions...</p>
      </div>
    );
  }

  return (
    <div className="people-suggestions">
      <h2 className="people-title">Suggested People</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="people-cards">
        {people.map((person) => (
          <div key={person._id || person.id} className="person-card">
            <img 
              src={person.avatar || "/avatars/avatar1.png"} 
              alt={person.name} 
              className="person-avatar"
              onError={(e) => {
                e.target.src = "/avatars/avatar1.png";
              }}
            />
            <div className="person-info">
              <h3>{person.name}</h3>
              <p>{person.interest || person.email}</p>
              <button 
                className="group-btn"
                onClick={() => handleCreateGroup(person)}
              >
                Create Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleSuggestions;