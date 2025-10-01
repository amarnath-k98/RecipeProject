import React from 'react'

const CommentList = ({ comments }) => {
  if (!comments.length) {
    return (
      <p className="text-gray-700 text-sm sm:text-base">No comments yet.</p>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment._id} className="border-b pb-2">
          <p className="text-sm sm:text-base md:text-lg text-gray-900">
            {comment.text}
          </p>
          <p className="text-xs sm:text-sm text-gray-700 mt-1">
            Posted by {comment.user?.name || "Anonymous"}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default CommentList;