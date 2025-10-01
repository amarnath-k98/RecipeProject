import React from 'react'

const ImageUpload = ({ value, onChange }) => {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; 
    if (file.size > maxSize) {
      alert("Image too large. Please upload a file under 2MB.");
      return;
    }

    
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='space-y-3'>
      {value && (
        <img
          src={value}
          alt='Preview'
          className='w-full h-48 sm:h-64 md:h-72 object-cover rounded'
        />
      )}

      <input
        type='file'
        accept='image/*'
        onChange={handleUpload}
        className='text-sm sm:text-base'
      />

    </div>
  )
}

export default ImageUpload;
