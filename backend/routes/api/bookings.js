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
                        attributes: ['url'],
                        as: 'previewImage'
                    },
                ] ,
            }
        ],
        group: ['Booking.id']
    });

	return res.json({"Bookings": bookings});
});


//Edit a booking
 router.put("/:bookingId", requireAuth, validateBooking, async (req, res) => {
   
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

    if (bookingEndDate < today){    
        return res.status(403).json({ message: "Past bookings can't be modified"});
    };

    //Booking conflict
    const dateError = {
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {}
    };
    
    if ((bookingStartDate <= booking.startDate) && (bookingEndDate < booking.endDate)) {
        dateError.errors.startDate = "Start date conflicts with an existing booking"
    } else if (( bookingStartDate > booking.startDate) && (bookingEndDate >= booking.endDate)) {
        dateError.errors.endDate = "End date conflicts with an existing booking" 
        } else if ((bookingStartDate > booking.startDate) && (bookingEndDate < booking.endDate)){
            dateError.errors.startDate = "Start date conflicts with an existing booking",
            dateError.errors.endDate = "End date conflicts with an existing booking" 
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