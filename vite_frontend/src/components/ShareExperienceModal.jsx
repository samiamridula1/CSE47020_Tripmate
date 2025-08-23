import { useState } from "react";
import { createExperience } from "../api/experienceApi";

const ShareExperienceModal = ({ userId, onClose, onUploadSuccess }) => {
  const [story, setStory] = useState("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!story || !location || !imageFile) {
      alert("Please fill in all fields and select an image.");
      return;
    }

    setLoading(true);
    
    try {
      const imageBase64 = await convertToBase64(imageFile);
      
      await createExperience({
        story,
        location,
        imageBase64,
        userId
      });

      // Reset form
      setStory("");
      setLocation("");
      setImageFile(null);
      setPreview(null);

      // Refresh dashboard and close modal
      onUploadSuccess();
      onClose();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Something went wrong while uploading. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Share Your Experience</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <textarea
            placeholder="Write your travel story..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows="4"
            className="w-full border rounded p-2"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
            required
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShareExperienceModal;