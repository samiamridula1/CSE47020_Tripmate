import { useEffect, useState } from "react";
import axios from "axios";

function Gallery({ location }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function fetchImages() {
      const res = await axios.get(`/api/experiences?location=${location}`);
      const filtered = res.data.filter(exp => exp.imageUrl); // Only show if image exists
      setImages(filtered.map(exp => ({
        url: exp.imageUrl,
        caption: exp.location
      })));
    }
    fetchImages();
  }, [location]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((img, index) => (
        <div key={index} className="rounded overflow-hidden shadow">
          <img src={img.url} alt={img.caption} className="w-full h-48 object-cover" />
          <p className="text-center text-sm text-gray-600 mt-1">{img.caption}</p>
        </div>
      ))}
    </div>
  );
}

export default Gallery;