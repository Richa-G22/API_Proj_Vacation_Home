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
        group: ['Booking.id','Spot.SpotImages.url','Spot.id']
    });

    bookings.forEach(booking => {
        let bookingJson = booking.toJSON();
        console.log('** booking json', bookingJson);
        console.log('** previewImage ', bookingJson['previewImage'])
        bookingJson['Spot']['previewImage'] = bookingJson['previewImage']
        console.log('** spot ', bookingJson )
        delete bookingJson.previewImage;
        bookingList.push(bookingJson);
    });
    console.log('@@@@@@@@bookingList',bookingList);

	return res.json({"Bookings": bookingList});
});


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

   // EndDate can not be same as start date
    if (Date.parse(bookingStartDate) === Date.parse(bookingEndDate)) {
        sameDatesError.errors.endDate = "endDate cannot be on or before startDate";
        return res.status(400).json(sameDatesError)   
    };

    // end date cannot be less than start date 
    if (bookingEndDate < bookingStartDate) {
        sameDatesError.errors.endDate = "endDate cannot come before startDate";
        return res.status(400).json(sameDatesError) 
    };

    // Bookings in the past cannot be modified
    if ((bookingStartDate < today) && (bookingEndDate < today)){    
        return res.status(403).json({ message: "Past bookings can't be modified"});
    };

    //Check for existing bookings
    const bookings = await Booking.findAll({
        where: {
            spotId: booking.spotId
        },
    });

    if (bookings.length) {
        bookings.forEach(element => {
            console.log('-----bookingStartDate', bookingStartDate);
            console.log('-----bookingEndDate', bookingEndDate);
            console.log('-----element.StartDate', element.startDate);
            console.log('-----element.endDate', element.endDate); 
            console.log('----element.id', element.id);
            console.log('-------bookingId', bookingId);
         
        if(parseInt(element.id) !== parseInt(req.params.bookingId)) {   
            console.log('----element.id', element.id);
            console.log('-------req.params.bookingId', req.params.bookingId);
            if (element.startDate <= bookingStartDate && element.startDate < bookingEndDate && element.endDate > bookingStartDate){
                dateError.errors.startDate = "Start date conflicts with an existing booking"
                console.log('------1-------');
            };

            if (element.startDate >= bookingStartDate && element.startDate < bookingEndDate && element.endDate >= bookingEndDate) {
                dateError.errors.endDate = "End date conflicts with an existing booking"
                console.log('------2-------'); 
            };

            if (element.startDate < bookingStartDate && element.endDate === bookingStartDate){
                dateError.errors.startDate = "Start date conflicts with an existing booking"  
                console.log('------3-------');
            };

           // if (element.startDate === bookingEndDate && element.endDate > bookingEndDate){
            if (Date.parse(element.startDate) === Date.parse(bookingEndDate) && element.endDate > bookingEndDate){
                dateError.errors.startDate = "End date conflicts with an existing booking" 
                console.log('------4-------'); 
            };

            if (element.startDate <= bookingStartDate && element.endDate >= bookingEndDate){
                dateError.errors.startDate = "Start date conflicts with an existing booking",
                dateError.errors.endDate = "End date conflicts with an existing booking"
                console.log('------5-------');  
            }

            //if (element.startDate < bookingStartDate && element.endDate === bookingStartDate) {
            if (Date.parse(element.endDate) === Date.parse(bookingStartDate)) {
                dateError.errors.startDate = "Start date conflicts with an existing booking",
                console.log('------8-------');
            } else if (element.startDate === bookingEndDate && element.endDate > bookingEndDate) {
                dateError.errors.endDate = "End date conflicts with an existing booking"
                console.log('------6-------');  
            };

            //Surrounding Dates
            if (element.startDate > bookingStartDate && element.endDate < bookingEndDate) {
                dateError.errors.startDate = "Start date conflicts with an existing booking",
                dateError.errors.endDate = "End date conflicts with an existing booking"
                console.log('------7-------');  
            }
        };
        })
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

    const bookingStartDate = new Date(deleteBooking.startDate);
    const bookingEndDate = new Date(deleteBooking.endDate);
    const today = new Date();

    if ((bookingStartDate < today) && (bookingEndDate > today)) {
        return res.status(403).json({ message: "Bookings that have been started can't be deleted"});
    }

    await deleteBooking.destroy();
    return res.json({ message: "Successfully deleted" });
});

module.exports = router;