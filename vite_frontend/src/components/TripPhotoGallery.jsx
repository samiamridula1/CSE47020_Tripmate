import React, { useState } from 'react';

const TripPhotoGallery = ({ photos = [], onAddPhoto, onRemovePhoto, tripId, readOnly = false }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Convert file to base64 for demo purposes
  // In production, you'd upload to a cloud service like Cloudinary or AWS S3
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Max size is 5MB`);
          continue;
        }
        
        const base64 = await fileToBase64(file);
        const photoData = {
          url: base64, // In production, this would be the cloud URL
          caption: '', // User can add caption later
          uploadedAt: new Date(),
          filename: file.name,
          size: file.size
        };
        
        await onAddPhoto(tripId, photoData);
      }
      setShowUpload(false);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Error uploading photos. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const handleRemovePhoto = (photoIndex) => {
    if (onRemovePhoto && window.confirm('Remove this photo?')) {
      onRemovePhoto(tripId, photoIndex);
    }
  };

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Trip Photos</h3>
        {!readOnly && (
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
          >
            <span>Add Photos</span>
          </button>
        )}
      </div>

      {/* Photo Upload Section */}
      {showUpload && !readOnly && (
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 space-y-3">
          <div className="text-center">
            <h4 className="font-medium text-gray-800 mb-2">Upload Photos</h4>
            
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-all ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-600 mb-2">
                  Drag & drop photos here, or{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                    browse files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Supports: JPG, PNG, GIF (Max 5MB per file)
                </p>
              </div>
            </div>
          </div>
          
          {uploading && (
            <div className="flex items-center justify-center space-x-2 py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-600">Uploading photos...</span>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={() => setShowUpload(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          <span className="text-4xl">📸</span>
          <p className="text-gray-500 mt-2">No photos yet</p>
          {!readOnly && (
            <p className="text-sm text-gray-400">Upload some photos to capture your trip memories!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => openLightbox(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || `Trip photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBDOTIuMjY4IDgwIDg2IDg2LjI2OCA4NiA5NEM4NiAxMDEuNzMyIDkyLjI2OCAxMDggMTAwIDEwOEMxMDcuNzMyIDEwOCAxMTQgMTAxLjczMiAxMTQgOTRDMTE0IDg2LjI2OCAxMDcuNzMyIDgwIDEwMCA4MFoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTcwIDEyMEwxMDAgOTBMMTMwIDEyMEg3MFoiIGZpbGw9IiM5Q0E0QUYiLz4KPC9zdmc+';
                  }}
                />
              </div>
              
              {!readOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto(index);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                >
                  ×
                </button>
              )}
              
              {/* Photo info on hover */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.filename && (
                  <div className="truncate">{photo.filename}</div>
                )}
                {photo.size && (
                  <div>{formatFileSize(photo.size)}</div>
                )}
              </div>
              
              {photo.caption && (
                <p className="mt-1 text-xs text-gray-600 truncate">{photo.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Trip photo'}
                className="max-w-full max-h-96 object-contain"
              />
              <button
                onClick={closeLightbox}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
              >
                ×
              </button>
            </div>
            {(selectedPhoto.caption || selectedPhoto.filename) && (
              <div className="p-4">
                {selectedPhoto.caption && (
                  <p className="text-gray-700">{selectedPhoto.caption}</p>
                )}
                {selectedPhoto.filename && (
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedPhoto.filename}
                    {selectedPhoto.size && ` • ${formatFileSize(selectedPhoto.size)}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPhotoGallery;
