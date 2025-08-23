// components/ExperienceFeed.jsx
import React from 'react';

const ExperienceFeed = ({ experiences }) => {
  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <div key={exp._id} className="border p-4 rounded shadow">
          <h3 className="text-lg font-bold text-blue-700">{exp.destination}</h3>
          <p className="text-sm text-gray-600">Shared by {exp.userName}</p>
          <p className="text-gray-700 italic">"{exp.story}"</p>
          {exp.image && (
            <img src={exp.image} alt={exp.destination} className="mt-2 rounded w-full max-h-60 object-cover" />
          )}
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{exp.tag}</span>
        </div>
      ))}
    </div>
  );
};

export default ExperienceFeed;