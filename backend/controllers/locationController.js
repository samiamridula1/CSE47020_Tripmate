const Location = require("../models/Location");

const searchLocations = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        
        if (!q || q.length < 2) {
            return res.json([]);
        }

        const searchQuery = {
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { aliases: { $regex: q, $options: 'i' } }
            ],
            isActive: true
        };

        const locations = await Location.find(searchQuery)
            .select('name type parentLocation')
            .limit(parseInt(limit))
            .sort({ type: 1, name: 1 });

        const formattedResults = locations.map(location => ({
            _id: location._id,
            name: location.name,
            type: location.type,
            fullName: location.parentLocation 
                ? `${location.name}, ${location.parentLocation}`
                : location.name,
            displayName: location.parentLocation 
                ? `${location.name} (${location.parentLocation})`
                : location.name
        }));

        res.json(formattedResults);
    } catch (err) {
        console.error("Error searching locations:", err);
        res.status(500).json({ message: "Error searching locations" });
    }
};

const getAllLocations = async (req, res) => {
    try {
        const { type } = req.query;
        const query = { isActive: true };
        
        if (type) {
            query.type = type;
        }

        const locations = await Location.find(query)
            .sort({ type: 1, name: 1 });
        
        res.json(locations);
    } catch (err) {
        console.error("Error fetching locations:", err);
        res.status(500).json({ message: "Error fetching locations" });
    }
};

const getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.json(location);
    } catch (err) {
        console.error("Error fetching location:", err);
        res.status(500).json({ message: "Error fetching location" });
    }
};

const createLocation = async (req, res) => {
    try {
        const location = new Location(req.body);
        const saved = await location.save();
        res.status(201).json({ message: "Location created!", location: saved });
    } catch (err) {
        console.error("Error creating location:", err);
        res.status(500).json({ message: "Error creating location" });
    }
};

module.exports = {
    searchLocations,
    getAllLocations,
    getLocationById,
    createLocation,
};
