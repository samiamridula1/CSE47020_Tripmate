import { useState, useEffect } from 'react';
import { getComments } from '../api/commentApi';

export default function CommentCount({ experienceId }) {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    if (experienceId) {
      fetchCommentCount();
    }
  }, [experienceId]);

  const fetchCommentCount = async () => {
    try {
      const comments = await getComments(experienceId);
      setCommentCount(comments.length);
    } catch (err) {
      console.error('Error fetching comment count:', err);
      setCommentCount(0);
    }
  };

  return (
    <div className="flex items-center gap-1 text-gray-500 text-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.013 9.013 0 01-5.316-1.75L3 21l2.25-3.684A8.972 8.972 0 013 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
      </svg>
      <span>{commentCount}</span>
    </div>
  );
}
