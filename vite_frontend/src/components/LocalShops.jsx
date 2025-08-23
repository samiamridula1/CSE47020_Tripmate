import { useEffect, useState } from "react";
import { fetchShopsByLocation } from "../api/shopApi";

export default function LocalShops({ location }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (location) {
      fetchShops();
    }
  }, [location]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchShopsByLocation(location);
      setShops(data);
    } catch (err) {
      console.error("Error fetching shops:", err);
      setError("Failed to load shops");
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800">Local Shops</h3>
        <p className="text-gray-500">Please specify a location to view shops.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-800">Shops in {location}</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading shops...</p>
      ) : shops.length === 0 ? (
        <p className="text-gray-500">No shops found for this location.</p>
      ) : (
        <ul className="space-y-4 mt-4">
          {shops.map((shop) => (
            <li key={shop._id} className="border p-4 rounded shadow-sm bg-gray-50">
              <h4 className="font-semibold text-indigo-700">{shop.name}</h4>
              <p className="text-gray-700">{shop.description}</p>
              <p className="text-sm text-gray-500 mt-1">Location: {shop.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}