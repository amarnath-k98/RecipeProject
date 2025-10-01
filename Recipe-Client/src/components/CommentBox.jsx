import React from 'react'

const CommentBox = ({ value, onChange, onSubmit }) => {
  
  return (
    <div>
      <form onSubmit={onSubmit} className="mt-4 space-y-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
          className="w-full border border-b-gray-300 rounded px-3 py text-sm sm:text-base md:text-lg"
        />

        <button
          type="submit"
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm sm:text-base"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}

export default CommentBox;
