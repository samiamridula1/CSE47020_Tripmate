import React from 'react';

const AddExperienceModal = ({ onClose }) => {
  return (
    <form className="bg-white p-6 rounded shadow space-y-4 w-[400px]">
      <h3 className="text-xl font-semibold text-gray-800">Add Trip Experience</h3>
      <input
        type="text"
        placeholder="Destination"
        className="border p-2 w-full rounded"
      />
      <textarea
        placeholder="Share your story..."
        className="border p-2 w-full rounded"
      />
      <input
        type="file"
        accept="image/*"
        className="border p-2 w-full rounded"
      />
      <select className="border p-2 w-full rounded">
        <option>Adventure</option>
        <option>Relaxing</option>
        <option>Romantic</option>
      </select>
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Experience
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-600 hover:underline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddExperienceModal;