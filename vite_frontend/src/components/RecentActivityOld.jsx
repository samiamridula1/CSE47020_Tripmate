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
      
      // Safety check for currentUserId
      if (!currentUserId) {
        console.log('Debug - No currentUserId provided');
        setActivities([]);
        setLoading(false);
        return;
      }
      
      // Get all experiences 
      const experiences = await getAllExperiences();
      
      // Safety check for experiences
      if (!experiences || !Array.isArray(experiences)) {
        console.log('Debug - No experiences or invalid format');
        setActivities([]);
        setLoading(false);
        return;
      }
      
      console.log('Debug - All experiences:', experiences);
      
      const allActivities = [];

      // 1. Your new experiences (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const yourRecentExperiences = experiences.filter(exp => {
        // Safety check for null/undefined experience or userId
        if (!exp || !exp.userId) return false;
        
        const expUserId = typeof exp.userId === 'object' ? exp.userId._id : exp.userId;
        const isYours = expUserId === currentUserId;
        const isRecent = exp.createdAt ? new Date(exp.createdAt) > thirtyDaysAgo : false;
        return isYours && isRecent;
      });

      yourRecentExperiences.forEach(exp => {
        allActivities.push({
          type: 'new_experience',
          experienceTitle: exp.location,
          experienceId: exp._id,
          userName: 'You',
          content: `shared a new experience in ${exp.location}`,
          createdAt: exp.createdAt
        });
      });

      // 2. Comments on your experiences (from others)
      const yourExperiences = experiences.filter(exp => {
        // Safety check for null/undefined experience or userId
        if (!exp || !exp.userId) return false;
        
        const expUserId = typeof exp.userId === 'object' ? exp.userId._id : exp.userId;
        return expUserId === currentUserId;
      });

      for (const exp of yourExperiences) {
        try {
          const comments = await getComments(exp._id);
          const othersComments = comments.filter(comment => {
            // Safety check for null/undefined comment or userId
            if (!comment || !comment.userId) return false;
            
            const commentUserId = typeof comment.userId === 'object' ? comment.userId._id : comment.userId;
            return commentUserId !== currentUserId;
          });
          
          othersComments.forEach(comment => {
            allActivities.push({
              type: 'comment_received',
              experienceTitle: exp.location,
              experienceId: exp._id,
              userName: comment.userName || 'Someone',
              content: comment.content,
              createdAt: comment.createdAt
            });
          });
        } catch (err) {
          console.error('Error fetching comments for experience:', err);
        }
      }

      // 3. Your comments on others' experiences
      const othersExperiences = experiences.filter(exp => {
        // Safety check for null/undefined experience or userId
        if (!exp || !exp.userId) return false;
        
        const expUserId = typeof exp.userId === 'object' ? exp.userId._id : exp.userId;
        return expUserId !== currentUserId;
      });

      for (const exp of othersExperiences) {
        try {
          const comments = await getComments(exp._id);
          const yourComments = comments.filter(comment => {
            // Safety check for null/undefined comment or userId
            if (!comment || !comment.userId) return false;
            
            const commentUserId = typeof comment.userId === 'object' ? comment.userId._id : comment.userId;
            return commentUserId === currentUserId;
          });
          
          yourComments.forEach(comment => {
            const expOwnerName = typeof exp.userId === 'object' ? exp.userId.name : 'someone';
            allActivities.push({
              type: 'comment_made',
              experienceTitle: exp.location,
              experienceId: exp._id,
              userName: 'You',
              content: comment.content,
              createdAt: comment.createdAt,
              targetUser: expOwnerName
            });
          });
        } catch (err) {
          console.error('Error fetching comments for experience:', err);
        }
      }

      // 4. Your new trips (last 30 days)
      try {
        const tripsResponse = await fetch('http://localhost:5000/api/trips');
        if (tripsResponse.ok) {
          const trips = await tripsResponse.json();
          console.log('Debug - All trips:', trips);
          
          const userTrips = trips.filter(trip => {
            const tripUserId = typeof trip.userId === 'object' ? trip.userId._id : trip.userId;
            const isYours = tripUserId === currentUserId;
            const isRecent = trip.createdAt ? 
              new Date(trip.createdAt) > thirtyDaysAgo : 
              new Date(trip.date) > thirtyDaysAgo;
            
            console.log('Debug - Trip check:', {
              tripId: trip._id,
              tripUserId,
              currentUserId,
              isYours,
              isRecent,
              createdAt: trip.createdAt,
              date: trip.date
            });
            
            return isYours && isRecent;
          });
          
          console.log('Debug - User trips:', userTrips);
          
          userTrips.forEach(trip => {
            allActivities.push({
              type: 'new_trip',
              experienceTitle: trip.destination,
              userName: 'You',
              content: `planned a trip to ${trip.destination}`,
              createdAt: trip.createdAt || trip.date,
              details: trip.details
            });
          });
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }

      // 5. Your hotel bookings (last 30 days)
      try {
        const hotelsResponse = await fetch('http://localhost:5000/api/hotels/bookings');
        if (hotelsResponse.ok) {
          const bookings = await hotelsResponse.json();
          console.log('Debug - All hotel bookings:', bookings);
          
          const userBookings = bookings.filter(booking => {
            // Handle both 'user' and 'userId' fields
            const bookingUserId = booking.user ? 
              (typeof booking.user === 'object' ? booking.user._id : booking.user) :
              (typeof booking.userId === 'object' ? booking.userId._id : booking.userId);
            const isYours = bookingUserId === currentUserId;
            const isRecent = booking.createdAt ? 
              new Date(booking.createdAt) > thirtyDaysAgo : false;
            
            console.log('Debug - Hotel booking check:', {
              bookingId: booking._id,
              bookingUserId,
              currentUserId,
              isYours,
              isRecent,
              createdAt: booking.createdAt
            });
            
            return isYours && isRecent;
          });
          
          console.log('Debug - User hotel bookings:', userBookings);
          
          userBookings.forEach(booking => {
            const isActive = booking.status !== 'cancelled';
            const hotelName = booking.hotelName || booking.name;
            allActivities.push({
              type: isActive ? 'hotel_booking' : 'hotel_cancelled',
              experienceTitle: hotelName,
              userName: 'You',
              content: isActive 
                ? `booked ${hotelName} in ${booking.location || booking.address}`
                : `cancelled booking at ${hotelName}`,
              createdAt: booking.updatedAt || booking.createdAt,
              details: `${booking.nights || '1'} nights, ${booking.rooms} room(s) - $${booking.price}`
            });
          });
        }
      } catch (error) {
        console.error('Error fetching hotel bookings:', error);
      }

      // 6. Your transport bookings (last 30 days)
      try {
        const transportResponse = await fetch('http://localhost:5000/api/transport');
        if (transportResponse.ok) {
          const bookings = await transportResponse.json();
          console.log('Debug - All transport bookings:', bookings);
          
          const userBookings = bookings.filter(booking => {
            const bookingUserId = typeof booking.user === 'object' ? booking.user._id : booking.user;
            const isYours = bookingUserId === currentUserId;
            const isRecent = new Date(booking.createdAt) > thirtyDaysAgo;
            
            console.log('Debug - Transport booking check:', {
              bookingId: booking._id,
              bookingUserId,
              currentUserId,
              isYours,
              isRecent,
              createdAt: booking.createdAt
            });
            
            return isYours && isRecent;
          });
          
          console.log('Debug - User transport bookings:', userBookings);
          
          userBookings.forEach(booking => {
            const isActive = booking.status !== 'cancelled';
            allActivities.push({
              type: isActive ? 'transport_booking' : 'transport_cancelled',
              experienceTitle: `${booking.type} - ${booking.provider}`,
              userName: 'You',
              content: isActive 
                ? `booked ${booking.type} with ${booking.provider}`
                : `cancelled ${booking.type} booking with ${booking.provider}`,
              createdAt: booking.updatedAt || booking.createdAt,
              details: `${booking.departureLocation} → ${booking.arrivalLocation} - $${booking.price}`
            });
          });
        }
      } catch (error) {
        console.error('Error fetching transport bookings:', error);
      }

      // Sort all activities by date and take latest 15
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 15);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <p className="text-sm text-gray-500">Your latest interactions and experiences</p>
        </div>
        <button 
          onClick={fetchRecentActivity}
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading recent activity...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-3">�</div>
          <p className="text-gray-500">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1">Your activity feed will show:</p>
          <ul className="text-xs text-gray-400 mt-2 space-y-1">
            <li>• New experiences you share</li>
            <li>• New trips you plan</li>
            <li>• Hotel bookings and cancellations</li>
            <li>• Transport bookings and cancellations</li>
            <li>• Comments on your experiences</li>
            <li>• Your comments on others' experiences</li>
          </ul>
          
          {/* Debug Information */}
          <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-100 rounded">
            <strong>Debug:</strong> User ID: {currentUserId}
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {/* Debug Information */}
          <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
            <strong>Debug:</strong> User ID: {currentUserId}
          </div>
          
          {activities.map((activity, index) => {
            let activityText = '';
            let iconColor = 'text-blue-400';
            let borderColor = 'border-blue-500';
            
            switch(activity.type) {
              case 'new_experience':
                activityText = `You shared a new experience in ${activity.experienceTitle}`;
                iconColor = 'text-green-400';
                borderColor = 'border-green-500';
                break;
              case 'new_trip':
                activityText = `You planned a trip to ${activity.experienceTitle}`;
                iconColor = 'text-indigo-400';
                borderColor = 'border-indigo-500';
                break;
              case 'hotel_booking':
                activityText = `You booked ${activity.experienceTitle}`;
                iconColor = 'text-emerald-400';
                borderColor = 'border-emerald-500';
                break;
              case 'hotel_cancelled':
                activityText = `You cancelled booking at ${activity.experienceTitle}`;
                iconColor = 'text-red-400';
                borderColor = 'border-red-500';
                break;
              case 'transport_booking':
                activityText = `You booked ${activity.experienceTitle}`;
                iconColor = 'text-cyan-400';
                borderColor = 'border-cyan-500';
                break;
              case 'transport_cancelled':
                activityText = `You cancelled ${activity.experienceTitle}`;
                iconColor = 'text-orange-400';
                borderColor = 'border-orange-500';
                break;
              case 'comment_received':
                activityText = `${activity.userName} commented on your experience in ${activity.experienceTitle}`;
                iconColor = 'text-blue-400';
                borderColor = 'border-blue-500';
                break;
              case 'comment_made':
                activityText = `You commented on ${activity.targetUser}'s experience in ${activity.experienceTitle}`;
                iconColor = 'text-purple-400';
                borderColor = 'border-purple-500';
                break;
              default:
                activityText = `${activity.userName} commented on ${activity.experienceTitle}`;
            }
            
            return (
              <div key={index} className={`border-l-4 ${borderColor} pl-4 py-3 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm">
                      {activityText}
                    </p>
                    
                    {activity.type === 'comment_received' || activity.type === 'comment_made' ? (
                      <div className="mt-2 p-2 bg-white rounded border-l-2 border-gray-200">
                        <p className="text-sm text-gray-700 italic">
                          "{activity.content.length > 80 ? activity.content.substring(0, 80) + '...' : activity.content}"
                        </p>
                      </div>
                    ) : (activity.type.includes('hotel') || activity.type.includes('transport') || activity.type === 'new_trip') && activity.details ? (
                      <div className="mt-2 p-2 bg-white rounded border-l-2 border-gray-200">
                        <p className="text-sm text-gray-700">
                          {activity.details}
                        </p>
                      </div>
                    ) : null}
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {activity.experienceId ? (
                        <Link 
                          to={`/experience/${activity.experienceId}`}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Experience →
                        </Link>
                      ) : activity.type === 'new_trip' ? (
                        <Link 
                          to="/trips"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Trips →
                        </Link>
                      ) : activity.type.includes('hotel') ? (
                        <Link 
                          to="/hotel-booking"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Hotels →
                        </Link>
                      ) : activity.type.includes('transport') ? (
                        <Link 
                          to="/transport"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Transport →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Activity Type Icon */}
                  {activity.type === 'new_experience' ? (
                    <svg className={`w-5 h-5 ${iconColor} mt-1 flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  ) : activity.type === 'new_trip' ? (
                    <svg className={`w-5 h-5 ${iconColor} mt-1 flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : activity.type === 'hotel_booking' ? (
                    <svg className={`w-5 h-5 ${iconColor} mt-1 flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  ) : activity.type === 'hotel_cancelled' ? (
                    <svg className={`w-5 h-5 ${iconColor} mt-1 flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : activity.type === 'transport_booking' ? (
                    <svg className={`w-5 h-5 ${iconColor} mt-1 flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  ) : activity.type === 'transport_cancelled' ? (
                    <svg className={`w-5 h-5 ${iconColor} mt-1 flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : activity.type === 'comment_made' ? (
                    <svg className={`w-5 h-5 ${iconColor} mt-1 flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                    </svg>
                  ) : (
                    <svg className={`w-5 h-5 ${iconColor} mt-1 flex-shrink-0 ml-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.013 9.013 0 01-5.316-1.75L3 21l2.25-3.684A8.972 8.972 0 013 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
