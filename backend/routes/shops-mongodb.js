// routes/shops-mongodb.js
// MongoDB version of shop routes

const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const Shop = require('../models/Shop');

// ============================================
// MIDDLEWARE: INPUT VALIDATION
// ============================================

const validateSearchQuery = [
  query('q')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Search query must be 2-200 characters')
    .escape(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
];

const validateNearbyQuery = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90')
    .toFloat(),
  query('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
    .toFloat(),
  query('radius_km')
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Radius must be between 0.1 and 100 km')
    .toFloat(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt()
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// ============================================
// ROUTE 1: TEXT/LANDMARK SEARCH
// ============================================

router.get('/search', validateSearchQuery, handleValidationErrors, async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    // MongoDB text search with scoring
    const results = await Shop.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .select('-__v')
      .sort({ score: { $meta: 'textScore' }, rating: -1 })
      .limit(parseInt(limit))
      .lean();

    return res.json({
      success: true,
      count: results.length,
      data: results.map(shop => ({
        id: shop._id,
        name: shop.name,
        address: shop.address,
        city: shop.city,
        state: shop.state,
        country: shop.country,
        postal_code: shop.postal_code,
        landmark: shop.landmark,
        latitude: shop.location.coordinates[1],
        longitude: shop.location.coordinates[0],
        rating: shop.rating,
        tags: shop.tags,
        relevance: shop.score
      })),
      meta: {
        query: q,
        limit,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search shops',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ROUTE 2: GPS PROXIMITY SEARCH
// ============================================

router.get('/nearby', validateNearbyQuery, handleValidationErrors, async (req, res) => {
  try {
    const { 
      lat, 
      lng, 
      radius_km = 5, 
      limit = 20 
    } = req.query;

    // MongoDB $geoNear aggregation
    const results = await Shop.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: 'distance',
          distanceMultiplier: 0.001, // meters to km
          maxDistance: radius_km * 1000, // km to meters
          spherical: true
        }
      },
      {
        $match: { is_active: true }
      },
      {
        $sort: { distance: 1, rating: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          _id: 1,
          name: 1,
          address: 1,
          city: 1,
          state: 1,
          country: 1,
          postal_code: 1,
          landmark: 1,
          rating: 1,
          tags: 1,
          latitude: { $arrayElemAt: ['$location.coordinates', 1] },
          longitude: { $arrayElemAt: ['$location.coordinates', 0] },
          distance_km: { $round: ['$distance', 2] }
        }
      }
    ]);

    return res.json({
      success: true,
      count: results.length,
      data: results.map(shop => ({
        id: shop._id,
        name: shop.name,
        address: shop.address,
        city: shop.city,
        state: shop.state,
        country: shop.country,
        postal_code: shop.postal_code,
        landmark: shop.landmark,
        latitude: shop.latitude,
        longitude: shop.longitude,
        rating: shop.rating,
        tags: shop.tags,
        distance_km: shop.distance_km
      })),
      meta: {
        center: { latitude: lat, longitude: lng },
        radius_km,
        method: 'MongoDB 2dsphere',
        limit,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Nearby search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to find nearby shops',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ============================================
// ROUTE 3: GET ALL SHOPS
// ============================================

router.get('/', async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const total = await Shop.countDocuments({ is_active: true });
    const results = await Shop.find({ is_active: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-__v')
      .lean();

    return res.json({
      success: true,
      count: results.length,
      total,
      data: results,
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: skip + limit < total
      }
    });

  } catch (error) {
    console.error('Get shops error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get shops'
    });
  }
});

// ============================================
// ROUTE 4: GET SINGLE SHOP
// ============================================

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const shop = await Shop.findById(id).select('-__v').lean();

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    return res.json({
      success: true,
      data: shop
    });

  } catch (error) {
    console.error('Get shop error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get shop'
    });
  }
});

// ============================================
// ROUTE 5: CREATE SHOP
// ============================================

router.post('/', async (req, res) => {
  try {
    const { name, address, city, state, country, postal_code, latitude, longitude, landmark, tags, rating } = req.body;

    // Validation
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, address, latitude, longitude'
      });
    }

    const newShop = new Shop({
      name,
      address,
      city: city || 'Indore',
      state: state || 'Madhya Pradesh',
      country: country || 'India',
      postal_code: postal_code || null,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      landmark,
      tags: tags || [],
      rating: rating || 0
    });

    await newShop.save();

    return res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: newShop
    });

  } catch (error) {
    console.error('Create shop error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create shop'
    });
  }
});

// ============================================
// ROUTE 6: UPDATE SHOP
// ============================================

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, state, country, postal_code, latitude, longitude, landmark, tags, rating } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (country) updateData.country = country;
    if (postal_code) updateData.postal_code = postal_code;
    if (landmark) updateData.landmark = landmark;
    if (tags) updateData.tags = tags;
    if (rating !== undefined) updateData.rating = rating;

    if (latitude !== undefined && longitude !== undefined) {
      updateData.location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
    }

    const shop = await Shop.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-__v');

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    return res.json({
      success: true,
      message: 'Shop updated successfully',
      data: shop
    });

  } catch (error) {
    console.error('Update shop error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update shop'
    });
  }
});

// ============================================
// ROUTE 7: DELETE SHOP
// ============================================

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Shop.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    return res.json({
      success: true,
      message: 'Shop deleted successfully',
      data: { id: result._id }
    });

  } catch (error) {
    console.error('Delete shop error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete shop'
    });
  }
});

module.exports = router;