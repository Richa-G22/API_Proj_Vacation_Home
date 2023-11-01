const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const router = express.Router();

//DELETE A SPOT IMAGE
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const deleteImage = await SpotImage.findByPk(req.params.imageId);
   
    if (!deleteImage) {
        const err = new Error("Spot Image couldn't be found");
        err.status = 404;
        return res.json({ message: "Spot Image couldn't be found" }, err.status);
    };

    const spot = await Spot.findByPk(deleteImage.spotId);

    if (parseInt(spot.ownerId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    await deleteImage.destroy();
    return res.json({ message: "Successfully deleted" });
});


module.exports = router;