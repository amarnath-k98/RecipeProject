import React from "react";

const VideoUpload = ({ value, onChange }) => {
  const isValidVideoURL = (url) => {
    return (
      url.includes("youtube.com/watch?v=") ||
      url.includes("youtu.be/") ||
      url.includes("vimeo.com/")
    );
  };

  const getEmbedURL = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("vimeo.com/")) {
      const videoId = url.split("vimeo.com/")[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
  };

  const embedURL = getEmbedURL(value);

  return (
    <div>
      <label className="block text-sm sm:text-base font-medium mb-1">
        Video URL (YouTube or Vimeo)
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://www.youtube.com/watch?v=..."
        className="w-full border border-gray-500 rounded px-3 py-2 text-sm sm:text-base"
      />

      {value && embedURL && (
        <div className="mt-4 aspect-video">
          <iframe
            src={embedURL}
            title="Recipe Video Preview"
            allowFullScreen
            className="w-full h-full rounded"
          ></iframe>
        </div>
      )}

      {value && !embedURL && (
        <p className="text-sm text-red-500 mt-2">
          Invalid video URL. Only YouTube or Vimeo links are supported.
        </p>
      )}
    </div>
  );
};

export default VideoUpload;
