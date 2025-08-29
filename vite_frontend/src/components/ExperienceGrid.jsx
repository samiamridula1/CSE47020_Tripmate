import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CommentCount from "./CommentCount";

export default function ExperienceGrid({ title, experiences, currentUserId, onDelete, showDelete, showOwner, emptyText, actions, gridCols = "md:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className="bg-white p-6 shadow rounded space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {actions}
      </div>
      {experiences.length === 0 ? (
        <p className="text-gray-500 text-center py-8">{emptyText}</p>
      ) : (
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {experiences.map((exp) => {
            const expUserId = typeof exp.userId === 'object' && exp.userId ? exp.userId._id : exp.userId;
            const isMyExperience = currentUserId && expUserId === currentUserId;
            return (
              <div key={exp._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
                <Link to={`/experience/${exp._id}`}>
                  <img
                    src={exp.imageUrl}
                    alt={exp.location}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="absolute top-3 right-3 flex gap-2">
                  {showOwner && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${isMyExperience ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                      {isMyExperience ? "My Experience" : "Community"}
                    </span>
                  )}
                  {showDelete && isMyExperience && (
                    <button
                      onClick={() => onDelete(exp._id)}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}
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
                  <div className="mt-4 flex gap-3 items-center justify-between">
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-gray-500">
                        {new Date(exp.createdAt).toLocaleDateString()}
                      </p>
                      <CommentCount experienceId={exp._id} />
                    </div>
                    <Link
                      to={`/experience/${exp._id}`}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                      Read Full Story →
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
