import React, { useState } from 'react';

const TripTemplates = ({ onSelectTemplate }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const templates = [
    {
      id: 'beach',
      name: 'Beach Vacation',
      description: 'Relaxing beach getaway',
      defaultDetails: 'Beach vacation with sun, sand, and relaxation',
      defaultNotes: 'Pack: Sunscreen, swimwear, beach towels, flip-flops, hat, sunglasses',
      suggestedDuration: 7
    },
    {
      id: 'city',
      name: 'City Tour',
      description: 'Urban exploration and sightseeing',
      defaultDetails: 'City exploration with museums, restaurants, and local attractions',
      defaultNotes: 'Pack: Comfortable walking shoes, city map/phone, camera, portable charger',
      suggestedDuration: 4
    },
    {
      id: 'adventure',
      name: 'Adventure Trip',
      description: 'Outdoor activities and hiking',
      defaultDetails: 'Adventure trip with hiking, nature exploration, and outdoor activities',
      defaultNotes: 'Pack: Hiking boots, backpack, water bottles, first aid kit, weather gear',
      suggestedDuration: 5
    },
    {
      id: 'business',
      name: 'Business Trip',
      description: 'Professional travel',
      defaultDetails: 'Business trip for meetings and professional activities',
      defaultNotes: 'Pack: Business attire, laptop, documents, business cards, phone charger',
      suggestedDuration: 3
    },
    {
      id: 'cultural',
      name: 'Cultural Experience',
      description: 'Museums, history, and culture',
      defaultDetails: 'Cultural trip to explore history, museums, and local traditions',
      defaultNotes: 'Pack: Comfortable clothes, notebook, camera, guidebook or app',
      suggestedDuration: 6
    }
  ];

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template);
    setShowTemplates(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowTemplates(!showTemplates)}
        className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
      >
        <span>Use Trip Template</span>
        <span className={`transform transition-transform ${showTemplates ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {showTemplates && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-800">Choose a Template</h3>
            <p className="text-xs text-gray-600">Pre-filled trip details to get you started</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="text-left p-3 rounded border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-800 text-sm group-hover:text-blue-700">
                    {template.name}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{template.description}</p>
                <p className="text-xs text-blue-600">
                  Suggested: {template.suggestedDuration} days
                </p>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-100">
            <button
              onClick={() => setShowTemplates(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripTemplates;
