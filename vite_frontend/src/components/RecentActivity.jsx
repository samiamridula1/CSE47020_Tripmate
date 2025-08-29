import { useState, useEffect } from 'react';
import { getComments } from '../api/commentApi';
import { getAllExperiences } from '../api/experienceApi';

export default function RecentActivity({ currentUserId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      fetchRecentActivity();
    }
  }, [currentUserId]);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      
      // Get all experiences to find user's experiences
      const experiences = await getAllExperiences();
      const userExperiences = experiences.filter(exp => {
        const expUserId = typeof exp.userId === 'object' ? exp.userId._id : exp.userId;
        return expUserId === currentUserId;
      });

      // Get recent comments on user's experiences
      const recentComments = [];
      for (const exp of userExperiences.slice(0, 3)) { // Limit to avoid too many requests
        try {
          const comments = await getComments(exp._id);
          const othersComments = comments.filter(comment => {
            const commentUserId = typeof comment.userId === 'object' ? comment.userId._id : comment.userId;
            return commentUserId !== currentUserId;
          });
          
          othersComments.forEach(comment => {
            recentComments.push({
              type: 'comment',
              experienceTitle: exp.location,
              experienceId: exp._id,
              userName: comment.userName || 'Anonymous',
              content: comment.content,
              createdAt: comment.createdAt
            });
          });
        } catch (err) {
          console.error('Error fetching comments for experience:', err);
        }
      }

      // Sort by date and take latest 5
      const sortedActivities = recentComments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setActivities(sortedActivities);
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserId) return null;

  return (
    <div className="bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
      
      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </div>
      ) : activities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No recent activity on your experiences</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium text-blue-600">{activity.userName}</span>
                    <span className="text-gray-600"> commented on </span>
                    <span className="font-medium">{activity.experienceTitle}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">"{activity.content.substring(0, 60)}..."</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.013 9.013 0 01-5.316-1.75L3 21l2.25-3.684A8.972 8.972 0 013 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
