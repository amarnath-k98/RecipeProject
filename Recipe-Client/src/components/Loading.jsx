import React from 'react'

const Loading = ({message = "Loading..."}) => {
  return (
    <div className="text-center min-h-screen py-10 sm:py-12 md:py-16 lg:py-20">
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-600 animate-pulse">
        {message}
      </p>
    </div>
  );
}

export default Loading;
