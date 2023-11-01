const express = require('express');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const router = express.Router();

const validateSpot = [
    check('address')    
      .not()
      .isEmpty()
      .withMessage('Street address is required'),
    check('city')
      .not()
      .isEmpty()
      .withMessage('City is required'),
    check('state')
      .not()
      .isEmpty()
     .withMessage('State is required'),
    check('country')
      .not()
      .isEmpty()
      .withMessage('Country is required'),
    check('lat')
      .not()
      .isEmpty()
      .withMessage('Latitude is not valid'),
    check('lng')
      .not()
      .isEmpty()
      .withMessage('Longitude is not valid'),
    check('name')
      .not()
      .isEmpty()
      .isLength({ min: 2 })
      .withMessage('Name is required'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    check('description')
      .not()
      .isEmpty()
      .withMessage('Description is required'),
    check('price')
      .not()
      .isEmpty()
      .withMessage('Price per day is required'),
    handleValidationErrors
  ];

  const validateReview = [
    check('stars')
      .not()
      .isEmpty()
      .isInt({ min: 1})
      .isInt({ max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
    check('review')
      .not()
      .isEmpty()
      .withMessage('Review text is required'),
    handleValidationErrors
  ]; 
  
  const validateBooking = [
    check('endDate')
      .custom((endDate, { req }) => {
        const startDate = req.body.startDate;
        if (startDate >= endDate) {
            return false
        }
        return true
    })
      .withMessage('EndDate cannot be on or before startDate'),
    handleValidationErrors
  ]; 

  const validateQuery = [
    check('maxLat')
        .optional()
        .isFloat()
        .withMessage("Maximum latitude is invalid"),
    check('minLat')
        .optional()
        .isFloat()
        .withMessage("Minimum latitude is invalid"),
    check('minLng')
        .optional()
        .isFloat()
        .withMessage("Minimum latitude is invalid"),
    check('maxLng')
        .optional()
        .isFloat()
        .withMessage("Maximum latitude is invalid"),
    check('minPrice')
        .optional()
        .isFloat({min:0})
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .optional()
        .isFloat({min:0})
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
  ]

// Get all Spots
/*router.get("/", async (req, res) => {
	const spots = await Spot.findAll({
        
        include: [
            {
                model: SpotImage,
                where : 'preview' === true,
                attributes: [],   
        }, {
                model: Review,
                attributes: [],
            }
        ],
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.col('SpotImages.url'), 'previewImage'] 
            ]
        },
        group: ['Spot.id']
    });

	return res.json({"Spots": spots});
});*/


// Get all Spots
router.get("/", validateQuery, async (req, res) => {
    
    console.log('@@@@@@', req.query)
	const spots = await Spot.findAll({
        
        include: [
            {
                model: SpotImage,
                where : 'preview' === true,
                attributes: [],   
        }, {
                model: Review,
                attributes: [],
            }
        ],
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.col('SpotImages.url'), 'previewImage'] 
            ]
        },
        group: ['Spot.id']
    });

    if (req.query.page) {
        let errorResult = { 
            message: "Bad Request",
            errors: {}
        };
        let { page, size } = req.query;

        const query = {};

        /*if (!page) page = 1;
        if (!size) size = 20;
        if (page > 10) page = 10;
        if (size > 20) size = 20;

        page = parseInt(page);
        size = parseInt(size);*/

        if (page < 1) {
            errorResult.errors.page = "Page must be greater than or equal to 1"
        };

        if (size < 1) {
            errorResult.errors.size = "Size must be greater than or equal to 1" 
        };

        if (
            Number.isInteger(page) && Number.isInteger(size) &&
            page > 0 && size > 0 && page <=10 && size <= 20
        ) {
            query.limit = size;
            query.offset = size * (page - 1);
        } 
        /*else if (page < 1) {
            errorResult.errors.page = "Page must be greater than or equal to 1"
        } else if (size < 1) {
            errorResult.errors.size = "Size must be greater than or equal to 1" 
        };*/
        const spots = await Spot.findAll({
        
            include: [
                {
                    model: SpotImage,
                    where : 'preview' === true,
                    attributes: [],   
            }, {
                    model: Review,
                    attributes: [],
                }
            ],
            ...query,
            attributes: {
                include: [
                    [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                    [sequelize.col('SpotImages.url'), 'previewImage'] 
                ]
            },

            group: ['Spot.id'],
            
        });
        return res.json({Spots: spots, page, size })
    };
    
  
        return res.json({"Spots": spots});
     	
});


// Get all Spots owned by the current logged in user
router.get("/current", requireAuth, async (req, res) => {
    
	const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id,
        },
        include: [
            {
                model: SpotImage,
                where : {'preview': true},
                attributes: [],   
        }, {
                model: Review,
                attributes: [],
        }, 
        ],
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
                [sequelize.col('SpotImages.url'), 'previewImage'] 
            ]
        },
        group: ['Spot.id']
    });

	return res.json({"Spots": spots});
});


//Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
    const  id = req.params.spotId; 
	const spots = await Spot.findOne({
  
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],   
        }, {
                model: Review,
                attributes: [],  
        }, {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "LastName"]
        }],
        where: {id},
        
        attributes: {
            include: [
                [sequelize.fn('COUNT', sequelize.col('review')), 'numReviews'],
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating'],
            ],
        },
        group: ['Spot.id', 'Owner.id', 'SpotImages.id'],
       
    });

    if (spots) {
        return res.json(spots);
    } else {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot couldn't be found" }, err.status);
    }	
});


//Create a Spot
router.post("/",requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    res.status = 201;
	const newSpot = await Spot.create({ 
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });
	return res.json(newSpot,res.status);
});


//Add an image to a Spot based on the Spot's id
router.post("/:spotId/images",requireAuth, async (req, res) => {
    const spotId  = req.params.spotId;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot couldn't be found" }, err.status);
    };

    if (parseInt(req.params.spotId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    const { url, preview } = req.body;    
	const newImage = await SpotImage.create({ 
        spotId: req.params.spotId,
        url,
        preview,
    });

    const imgRes = {};
    imgRes.id = newImage.id;
    imgRes.url = newImage.url;
    imgRes.preview = newImage.preview;

	return res.json(imgRes);
});


//Edit a Spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const spotId  = req.params.spotId;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot couldn't be found" }, err.status);
    };

    if (parseInt(spot.ownerId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    spot.ownerId = req.user.id, 
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();

    return res.json( spot );

});


// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const deleteSpot = await Spot.findByPk(req.params.spotId);
   
    if (!deleteSpot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot couldn't be found" }, err.status);
    };

    if (parseInt(req.params.spotId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    await deleteSpot.destroy();
    return res.json({ message: "Successfully deleted" });
});


// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot couldn't be found" }, err.status);
    };
    
	const reviews = await Review.findAll({
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"] 
        }, {
                model: ReviewImage,
                attributes: ['id','url'],  
        }],
        where: {
                spotId: req.params.spotId
         },   
    });
    return res.json({"Reviews": reviews});    
});

//Create a Review for a Spot based on the Spot's id
router.post("/:spotId/reviews", requireAuth, validateReview, async (req, res) => {
    const spotId  = req.params.spotId;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot couldn't be found" }, err.status);
    };
    
    const rev = await Review.findAll({
        where: {
            userId: req.user.id, 
        }
    });

    if (rev) {
        const err = new Error("User already has a review for this spot");
        err.status = 500;
        return res.json({ message: "User already has a review for this spot" }, err.status);
    };

    if (parseInt(spot.ownerId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    res.status = 201;
    const { review, stars } = req.body;    
    
	const newReview = await Review.create({ 
        userId: req.user.id,
        spotId: req.params.spotId,
        review,
        stars,
    });
    
    const revRes = {};
    revRes.id = newReview.id;
    revRes.userId = newReview.userId;
    revRes.spotId = newReview.spotId;
    revRes.review = newReview.review;
    revRes.stars = newReview.stars;
    revRes.createdAt = newReview.createdAt;
    revRes.updatedAt = newReview.createdAt;

	return res.json(revRes, res.status);
});


// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot){
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot couldn't be found" }, err.status);
    };
    
    if (spot.ownerId === req.user.id) {
        const bookings = await Booking.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"] 
            }],
            where: {
                    spotId: req.params.spotId
             },   
        });
        return res.json({"Bookings": bookings})

    } else {
        const bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
         }, 
         attributes: ['spotId', 'startDate', 'endDate'] 
        })
        return res.json({"Bookings": bookings})
    }    
});


// Create a Booking from a Spot based on the Spot's id

router.post("/:spotId/bookings", requireAuth, validateBooking, async (req, res) => {
    const spotId  = req.params.spotId;

    //Spot Not found
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
        const err = new Error("Spot couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot couldn't be found" }, err.status);
    };

    //Spot can not be owned by the current logged in User
    if (parseInt(spot.ownerId) === parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    //Booking Conflict
    const { startDate, endDate } = req.body;   
    console.log('$$$$$$startDate', startDate);
    console.log('%%%%%endDate', endDate);
    const bookingStartDate = new Date(startDate);
    const bookingEndDate = new Date(endDate);
    console.log('@@@@@bookingStartDate',bookingStartDate);
    console.log('#####bookingEndDate',bookingEndDate);

    const dateError = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
    };
    
    const currentBookingStartDate = await Booking.findAll({
        where: {
            spotId: req.params.spotId,
          //  startDate: { [Op.lte]: bookingEndDate },
           startDate: {[Op.and] : [{[Op.lte]: bookingStartDate}, {[Op.lt]: bookingEndDate}]},
          //  endDate: { [Op.and]: [{[Op.gte]: bookingStartDate}, {[Op.lte]: bookingEndDate}]}
          //  endDate: {[Op.and] : [{[Op.gte]: bookingStartDate}, {[Op.lt]: bookingEndDate}]},
            endDate: { [Op.gte]: bookingStartDate },
        }
    });
    console.log('*****currentBookingStartDate', currentBookingStartDate);
    if (currentBookingStartDate.length) {
        dateError.errors.startDate = "Start date conflicts with an existing booking"
    };

    const currentBookingEndDate = await Booking.findAll({
        where: {
            spotId: req.params.spotId,
            startDate: { [Op.lte]: bookingEndDate },
          //  startDate: {[Op.and] : [{[Op.gt]: bookingStartDate}, {[Op.lte]: bookingEndDate}]},
           // endDate: {[Op.and] : [{[Op.gte]: bookingStartDate}, {[Op.gte]: bookingEndDate}]},
           // endDate: { [Op.and]: [{[Op.gte]: bookingStartDate}, {[Op.lte]: bookingEndDate}]}
           endDate: { [Op.gte]: bookingEndDate },
        }
    });
    console.log('*****currentBookingEndDate', currentBookingEndDate);
    if (currentBookingEndDate.length) {
        dateError.errors.endDate = "End date conflicts with an existing booking"
    };

    const currentBookingsBothDates = await Booking.findAll({
        where: {
            spotId: req.params.spotId,
            startDate: { [Op.gte]: bookingStartDate },
            endDate: { [Op.lte]: bookingEndDate }
        }
    })

    if (currentBookingsBothDates.length) {
        dateError.errors.startDate = "Start date conflicts with an existing booking",
        dateError.errors.endDate = "End date conflicts with an existing booking"
    };

    if (dateError.errors.startDate || dateError.errors.endDate) {
        return res.status(403).json(dateError)
    };

    //New Booking
	const newBooking = await Booking.create({ 
        userId: req.user.id,
        spotId: req.params.spotId,
        startDate,
        endDate,
    });
    
    const bookingRes = {};
    bookingRes.id = newBooking.id;
    bookingRes.spotId = newBooking.spotId;
    bookingRes.userId = newBooking.userId;
    bookingRes.startDate = newBooking.startDate;
    bookingRes.endDate = newBooking.endDate;
    bookingRes.createdAt = newBooking.createdAt;
    bookingRes.updatedAt = newBooking.createdAt;

	return res.status(200).json(bookingRes);
});


module.exports = router;