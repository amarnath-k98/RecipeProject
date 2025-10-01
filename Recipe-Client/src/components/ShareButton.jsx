import React from 'react'

const ShareButton = ({ recipeId }) => {
    const handleShare = async () => {
        const url = `${window.location.origin}/recipes/${recipeId}`
        try {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
        } catch (err) {
            console.error("Share failed: ", err);
        }
    };

  return (
    <button
      onClick={handleShare}
      className="px-3 py-1 bg-gray-500 hover:bg-gray-700 text-white rounded text-sm sm:text-base"
    >
      Share 🔗
    </button>
  );
}

export default ShareButton;
