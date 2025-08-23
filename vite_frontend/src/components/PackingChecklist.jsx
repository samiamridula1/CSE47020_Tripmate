import React, { useState, useEffect } from "react";
import { getChecklist, updateChecklist, addChecklistItem, removeChecklistItem } from "../api/checklistApi";

export default function PackingChecklist({ userId = null }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);

  // Get user ID from props or localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = userId || storedUser._id || storedUser.id;

  // Load checklist from database on mount
  useEffect(() => {
    if (currentUserId) {
      loadChecklist();
    } else {
      // Fallback to default items if no user
      setItems([
        { _id: "default1", text: "Passport", completed: false },
        { _id: "default2", text: "Phone Charger", completed: false },
        { _id: "default3", text: "Sunscreen", completed: false },
      ]);
      setLoading(false);
    }
  }, [currentUserId]);

  const loadChecklist = async () => {
    try {
      setLoading(true);
      const checklist = await getChecklist(currentUserId);
      if (checklist.items.length === 0) {
        // Add default items for new users
        const defaultItems = [
          { text: "Passport", completed: false },
          { text: "Phone Charger", completed: false },
          { text: "Sunscreen", completed: false },
        ];
        await updateChecklist(currentUserId, defaultItems);
        const updatedChecklist = await getChecklist(currentUserId);
        setItems(updatedChecklist.items);
      } else {
        setItems(checklist.items);
      }
    } catch (err) {
      console.error("Failed to load checklist:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (index) => {
    if (!currentUserId) {
      // Fallback for non-logged users
      const updated = [...items];
      updated[index].completed = !updated[index].completed;
      setItems(updated);
      return;
    }

    try {
      const updated = [...items];
      updated[index].completed = !updated[index].completed;
      setItems(updated);
      await updateChecklist(currentUserId, updated);
    } catch (err) {
      console.error("Failed to update checklist:", err);
      // Revert on error
      loadChecklist();
    }
  };

  const handleAddItem = async () => {
    if (newItem.trim() === "") return;
    
    if (!currentUserId) {
      // Fallback for non-logged users
      setItems([...items, { _id: Date.now().toString(), text: newItem.trim(), completed: false }]);
      setNewItem("");
      return;
    }

    try {
      await addChecklistItem(currentUserId, newItem.trim());
      setNewItem("");
      loadChecklist(); // Refresh from server
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleDelete = async (index) => {
    if (!currentUserId) {
      // Fallback for non-logged users
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      return;
    }

    try {
      const itemId = items[index]._id;
      await removeChecklistItem(currentUserId, itemId);
      loadChecklist(); // Refresh from server
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 shadow rounded space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Packing Checklist</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Packing Checklist</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item..."
          className="border p-2 rounded w-full"
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item._id || index}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggle(index)}
              />
              <span
                className={`${
                  item.completed ? "line-through text-gray-500" : "text-gray-800"
                }`}
              >
                {item.text}
              </span>
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-500 hover:underline text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      {items.length === 0 && (
        <p className="text-gray-500 text-center py-4">No items in your checklist yet</p>
      )}
    </div>
  );
}