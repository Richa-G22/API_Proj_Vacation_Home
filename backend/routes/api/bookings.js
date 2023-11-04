const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth} = require('../../utils/auth');
const { Booking, Spot, SpotImage, Review, ReviewImage, User, Sequelize } = require('../../db/models');
const router = express.Router();

const validateBooking = [
    check('endDate')
      .custom((endDate, { req }) => {
        const startDate = req.body.startDate;
        if (startDate >= endDate) {
            return false
        }
        return true
    })
      .withMessage('EndDate cannot come before startDate'),
    handleValidationErrors
  ]; 

// Get all of the Current User's Bookings 
router.get("/current", requireAuth, async (req, res) => {
    const bookingList = [];

	const bookings = await Booking.findAll({
        where: {
            userId: req.user.id,
        },
        include: [
            {
                model: Spot,
                attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price'], 
                include: [
                    {
                        model: SpotImage,
                        attributes: [],
                    },
                ] ,
            },    
        ],
        attributes: {
            include: [  
                [Sequelize.col('Spot.SpotImages.url'), 'previewImage'] 
            ]
        }, 
        group: ['Booking.id']
    });

    bookings.forEach(booking => {
        bookingList.push(booking.toJSON());
    });
    console.log('@@@@@@@@bookingList',bookingList);

    bookingList.forEach(booking => {
        booking['previewImage'] = booking.Spot['previewImage']
    })
    console.log('@@@@@@@@bookingList',bookingList);
    let spotList = [];
    let previewImage;
    let modifiedSpot = {};

   //bookingList.forEach(booking => {
        const spots = await Spot.findAll({
            where: {
                ownerId: req.user.id
            },
            include: [
                {
                    model: SpotImage,
                }
            ]   
    });

    spots.forEach(spot => {    
        spotList.push(spot.toJSON());
    });

    spotList.forEach(spot => {
        modifiedSpot.ownerId = spot.ownerId;
        modifiedSpot.address = spot.address;
        modifiedSpot.city = spot.city;
        modifiedSpot.state = spot.state;
        modifiedSpot.country = spot.country;
        modifiedSpot.lat = spot.lat;
        modifiedSpot.lng = spot.lng;
        modifiedSpot.name = spot.name;
        modifiedSpot.price = spot.price;

        spot.SpotImages.forEach(image => {
            modifiedSpot.id = spots.id;
    
            if (image.preview === true) {
                previewImage = image.url;
            }
        })
    });
    modifiedSpot.previewImage = previewImage;

    bookingList.forEach(booking => {
        booking['Spot'] = modifiedSpot;
    });

	return res.json({"Bookings": bookings});
});
//});


//Edit a booking
 router.put("/:bookingId", requireAuth, async (req, res) => {
   
    const bookingId  = req.params.bookingId;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return res.json({ message: "Booking couldn't be found" }, err.status);
    };

    if (parseInt(booking.userId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    const { startDate, endDate } = req.body;

    const bookingStartDate = new Date(startDate);
    const bookingEndDate = new Date(endDate);
    const today = new Date();

    

    //Booking conflict
    const dateError = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
    };

    const sameDatesError = {
        message: "Bad Request",
        errors: {}
    };

    if (Date.parse(bookingStartDate) === Date.parse(bookingEndDate)) {
        sameDatesError.errors.endDate = "endDate cannot be on or before startDate";
        return res.status(400).json(sameDatesError)   
    };

    if (bookingEndDate < bookingStartDate) {
        sameDatesError.errors.endDate = "endDate cannot come before startDate";
        return res.status(400).json(sameDatesError) 
    };

    
    
    if ((bookingStartDate <= booking.startDate) && (bookingEndDate < booking.endDate && bookingEndDate > booking.startDate)) {
        dateError.errors.startDate = "Start date conflicts with an existing booking"
    } else if (( bookingStartDate > booking.startDate) && (bookingEndDate >= booking.endDate)) {
        dateError.errors.endDate = "End date conflicts with an existing booking" 
        } /*else if (((bookingStartDate > booking.startDate) && (bookingEndDate < booking.endDate)) ||
                   ((bookingStartDate < booking.startDate) && (bookingEndDate > booking.endDate))){
            dateError.errors.startDate = "Start date conflicts with an existing booking",
            dateError.errors.endDate = "End date conflicts with an existing booking" 
        };*/

    if (((bookingStartDate === booking.startDate) || (bookingStartDate === booking.endDate))) {
        dateError.errors.startDate = "Start date conflicts with an existing booking" 
    } else if (((bookingEndDate === booking.startDate) || (bookingEndDate === booking.endDate))) {
        dateError.errors.endDate = "End date conflicts with an existing booking" 
    };

    if (bookingStartDate > booking.endDate){    
        return res.status(403).json({ message: "Past bookings can't be modified"});
    };

    if (dateError.errors.startDate || dateError.errors.endDate) {
        return res.status(403).json(dateError)
    };

    // Booking changes
    booking.startDate = bookingStartDate, 
    booking.endDate = bookingEndDate;

    await booking.save();
    return res.json( booking );
});


//DELETE a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const deleteBooking = await Booking.findByPk(req.params.bookingId);

    const bookingStartDate = new Date(deleteBooking.startDate);
    const bookingEndDate = new Date(deleteBooking.endDate);
    const today = new Date();
   
    if (!deleteBooking) {
        const err = new Error("Booking couldn't be found");
        err.status = 404;
        return res.json({ message: "Booking couldn't be found" }, err.status);
    };

    if (parseInt(deleteBooking.userId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    if ((bookingStartDate < today) && (bookingEndDate > today)) {
        return res.status(403).json({ message: "Bookings that have been started can't be deleted"});
    }

    await deleteBooking.destroy();
    return res.json({ message: "Successfully deleted" });
});

module.exports = router;