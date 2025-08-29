import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComments } from '../api/commentApi';
import { getAllExperiences } from '../api/experienceApi';

export default function RecentActivity({ currentUserId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserId) {
      fetchRecentActivity();
    } else {
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      
      if (!currentUserId) {
        setActivities([]);
        setLoading(false);
        return;
      }
      
      const experiences = await getAllExperiences();
      
      if (!experiences || !Array.isArray(experiences)) {
        setActivities([]);
        setLoading(false);
        return;
      }
      
      const allActivities = [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // 1. Your new experiences (last 30 days)
      const yourRecentExperiences = experiences.filter(exp => {
        if (!exp || !exp.userId) return false;
        const expUserId = typeof exp.userId === 'object' ? exp.userId._id : exp.userId;
        const isYours = expUserId === currentUserId;
        const isRecent = exp.createdAt ? new Date(exp.createdAt) > thirtyDaysAgo : false;
        return isYours && isRecent;
      });

      yourRecentExperiences.forEach(exp => {
        allActivities.push({
          type: 'new_experience',
          title: exp.location,
          content: `You shared a new experience in ${exp.location}`,
          timestamp: exp.createdAt,
          link: `/experience/${exp._id}`
        });
      });

      // 2. Comments on your experiences (from others)
      const yourExperiences = experiences.filter(exp => {
        if (!exp || !exp.userId) return false;
        const expUserId = typeof exp.userId === 'object' ? exp.userId._id : exp.userId;
        return expUserId === currentUserId;
      });

      for (const exp of yourExperiences) {
        try {
          const comments = await getComments(exp._id);
          const othersComments = comments.filter(comment => {
            if (!comment || !comment.userId) return false;
            const commentUserId = typeof comment.userId === 'object' ? comment.userId._id : comment.userId;
            return commentUserId !== currentUserId;
          });
          
          othersComments.forEach(comment => {
            allActivities.push({
              type: 'comment_received',
              title: `Comment on ${exp.location}`,
              content: `${comment.userName} commented: "${comment.content.substring(0, 50)}..."`,
              timestamp: comment.createdAt,
              link: `/experience/${exp._id}`
            });
          });
        } catch (err) {
          console.error('Error fetching comments for experience:', err);
        }
      }

      // Sort by timestamp and take latest 10
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);

      setActivities(sortedActivities);
      
    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUserId) return null;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_experience':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'comment_received':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.013 9.013 0 01-5.316-1.75L3 21l2.25-3.684A8.972 8.972 0 013 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
        <button 
          onClick={fetchRecentActivity}
          className="text-blue-600 hover:text-blue-700 text-sm"
        >
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-3xl mb-3">📝</div>
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1">Share experiences or interact with others to see activity here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {activity.link && (
                    <Link 
                      to={activity.link}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      View →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
