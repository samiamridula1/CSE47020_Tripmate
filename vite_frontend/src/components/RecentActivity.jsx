import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComments } from '../api/commentApi';
import { getAllExperiences } from '../api/experienceApi';

export default function RecentActivity({ currentUserId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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
      
      const allActivities = [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // 1. Experience Activities
      try {
        const experiences = await getAllExperiences();
        if (experiences && Array.isArray(experiences)) {
          // Your new experiences
          const yourRecentExperiences = experiences.filter(exp => {
            if (!exp || !exp.userId) return false;
            const expUserId = typeof exp.userId === 'object' ? exp.userId._id : exp.userId;
            const isYours = expUserId === currentUserId;
            const isRecent = exp.createdAt ? new Date(exp.createdAt) > thirtyDaysAgo : false;
            return isYours && isRecent;
          });

          yourRecentExperiences.forEach(exp => {
            allActivities.push({
              type: 'experience_shared',
              title: `Experience Shared: ${exp.location}`,
              content: `You shared an experience in ${exp.location}`,
              timestamp: exp.createdAt,
              link: `/experience/${exp._id}`
            });
          });

          // Comments on your experiences (from others)
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
                const isRecent = comment.createdAt ? new Date(comment.createdAt) > thirtyDaysAgo : false;
                return commentUserId !== currentUserId && isRecent;
              });
              
              othersComments.forEach(comment => {
                allActivities.push({
                  type: 'comment_received',
                  title: `Comment on ${exp.location}`,
                  content: `${comment.userName}: "${comment.content.substring(0, 40)}..."`,
                  timestamp: comment.createdAt,
                  link: `/experience/${exp._id}`
                });
              });
            } catch (err) {
              console.error('Error fetching comments for experience:', err);
            }
          }

          // Your comments on others' experiences
          for (const exp of experiences) {
            if (!exp || !exp._id) continue;
            try {
              const comments = await getComments(exp._id);
              const yourComments = comments.filter(comment => {
                if (!comment || !comment.userId) return false;
                const commentUserId = typeof comment.userId === 'object' ? comment.userId._id : comment.userId;
                const isYours = commentUserId === currentUserId;
                const isRecent = comment.createdAt ? new Date(comment.createdAt) > thirtyDaysAgo : false;
                return isYours && isRecent;
              });
              
              yourComments.forEach(comment => {
                allActivities.push({
                  type: 'comment_posted',
                  title: `You commented on ${exp.location}`,
                  content: `"${comment.content.substring(0, 40)}..."`,
                  timestamp: comment.createdAt,
                  link: `/experience/${exp._id}`
                });
              });
            } catch (err) {
              console.error('Error fetching comments for experience:', err);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
      }

      // 2. Trip Activities
      try {
        const tripsResponse = await fetch('http://localhost:5000/api/trips');
        if (tripsResponse.ok) {
          const trips = await tripsResponse.json();
          if (trips && Array.isArray(trips)) {
            const yourRecentTrips = trips.filter(trip => {
              if (!trip || !trip.userId) return false;
              const tripUserId = typeof trip.userId === 'object' ? trip.userId._id : trip.userId;
              const isYours = tripUserId === currentUserId;
              const isRecent = trip.createdAt ? new Date(trip.createdAt) > thirtyDaysAgo : false;
              return isYours && isRecent;
            });

            yourRecentTrips.forEach(trip => {
              if (trip.status === 'cancelled') {
                allActivities.push({
                  type: 'trip_cancelled',
                  title: `Trip Cancelled: ${trip.destination}`,
                  content: `You cancelled your trip to ${trip.destination}`,
                  timestamp: trip.updatedAt || trip.createdAt,
                  link: `/trips`
                });
              } else {
                allActivities.push({
                  type: 'trip_created',
                  title: `Trip Planned: ${trip.destination}`,
                  content: `You planned a trip to ${trip.destination}`,
                  timestamp: trip.createdAt,
                  link: `/trips`
                });
              }
            });
          }
        }
      } catch (err) {
        console.error('Error fetching trips:', err);
      }

      // 3. Hotel Booking Activities
      try {
        const hotelsResponse = await fetch('http://localhost:5000/api/hotels/bookings');
        if (hotelsResponse.ok) {
          const bookings = await hotelsResponse.json();
          if (bookings && Array.isArray(bookings)) {
            const yourRecentBookings = bookings.filter(booking => {
              if (!booking || !booking.userId) return false;
              const bookingUserId = typeof booking.userId === 'object' ? booking.userId._id : booking.userId;
              const isYours = bookingUserId === currentUserId;
              const isRecent = booking.createdAt ? new Date(booking.createdAt) > thirtyDaysAgo : false;
              return isYours && isRecent;
            });

            yourRecentBookings.forEach(booking => {
              if (booking.status === 'cancelled') {
                allActivities.push({
                  type: 'hotel_cancelled',
                  title: `Hotel Booking Cancelled`,
                  content: `You cancelled booking at ${booking.hotelName || 'hotel'} in ${booking.location || 'Unknown'}`,
                  timestamp: booking.updatedAt || booking.createdAt,
                  link: `/hotel-booking`
                });
              } else {
                allActivities.push({
                  type: 'hotel_booked',
                  title: `Hotel Booked: ${booking.hotelName || 'Hotel'}`,
                  content: `You booked ${booking.hotelName || 'a hotel'} in ${booking.location || 'Unknown'}`,
                  timestamp: booking.createdAt,
                  link: `/hotel-booking`
                });
              }
            });
          }
        }
      } catch (err) {
        console.error('Error fetching hotel bookings:', err);
      }

      // 4. Transport Booking Activities
      try {
        const transportResponse = await fetch('http://localhost:5000/api/transport');
        if (transportResponse.ok) {
          const transportBookings = await transportResponse.json();
          if (transportBookings && Array.isArray(transportBookings)) {
            const yourRecentTransport = transportBookings.filter(booking => {
              if (!booking || !booking.userId) return false;
              const bookingUserId = typeof booking.userId === 'object' ? booking.userId._id : booking.userId;
              const isYours = bookingUserId === currentUserId;
              const isRecent = booking.createdAt ? new Date(booking.createdAt) > thirtyDaysAgo : false;
              return isYours && isRecent;
            });

            yourRecentTransport.forEach(booking => {
              if (booking.status === 'cancelled') {
                allActivities.push({
                  type: 'transport_cancelled',
                  title: `Transport Booking Cancelled`,
                  content: `You cancelled ${booking.transportType || 'transport'} from ${booking.from || 'origin'} to ${booking.to || 'destination'}`,
                  timestamp: booking.updatedAt || booking.createdAt,
                  link: `/transport-booking`
                });
              } else {
                allActivities.push({
                  type: 'transport_booked',
                  title: `Transport Booked`,
                  content: `You booked ${booking.transportType || 'transport'} from ${booking.from || 'origin'} to ${booking.to || 'destination'}`,
                  timestamp: booking.createdAt,
                  link: `/transport-booking`
                });
              }
            });
          }
        }
      } catch (err) {
        console.error('Error fetching transport bookings:', err);
      }

      // 5. Expense Activities (if available)
      try {
        const expensesResponse = await fetch('http://localhost:5000/api/expenses');
        if (expensesResponse.ok) {
          const expenses = await expensesResponse.json();
          if (expenses && Array.isArray(expenses)) {
            const yourRecentExpenses = expenses.filter(expense => {
              if (!expense || !expense.userId) return false;
              const expenseUserId = typeof expense.userId === 'object' ? expense.userId._id : expense.userId;
              const isYours = expenseUserId === currentUserId;
              const isRecent = expense.createdAt ? new Date(expense.createdAt) > thirtyDaysAgo : false;
              return isYours && isRecent;
            });

            yourRecentExpenses.forEach(expense => {
              allActivities.push({
                type: 'expense_added',
                title: `Expense Added: ${expense.category || 'General'}`,
                content: `You added an expense of $${expense.amount} for ${expense.description || expense.category}`,
                timestamp: expense.createdAt,
                link: `/budget`
              });
            });
          }
        }
      } catch (err) {
        console.error('Error fetching expenses:', err);
      }

      // Sort by timestamp and take latest 20 activities
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 20);

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
      case 'experience_shared':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
      case 'comment_posted':
        return (
          <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        );
      case 'trip_created':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        );
      case 'trip_cancelled':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'hotel_booked':
        return (
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </div>
        );
      case 'hotel_cancelled':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
      case 'transport_booked':
        return (
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        );
      case 'transport_cancelled':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          </div>
        );
      case 'expense_added':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
          {(showAll ? activities : activities.slice(0, 5)).map((activity, index) => (
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
          {activities.length > 5 && (
            <button
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
