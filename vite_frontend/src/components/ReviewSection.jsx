import { useState, useEffect } from "react";
import { fetchReviewsByLocation, addReview } from "../api/reviewApi";

export default function ReviewSection({ location, userId }) {
  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location) {
      fetchReviews();
    }
  }, [location]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchReviewsByLocation(location);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      setError("");
      
      const reviewData = {
        user: userId,
        content: content.trim(),
        rating,
        location
      };

      await addReview(reviewData);
      setContent("");
      setRating(5);
      await fetchReviews();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <p className="text-gray-500">Please specify a location to view reviews.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Reviews for {location}</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review..."
          className="border p-2 w-full rounded"
          rows="3"
          required
        />
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Rating:</label>
          <select 
            value={rating} 
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-1 rounded"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
            ))}
          </select>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {loading && reviews.length === 0 ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="border p-3 rounded shadow bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-800">
                    {review.user?.name || "Anonymous User"}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </span>
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}