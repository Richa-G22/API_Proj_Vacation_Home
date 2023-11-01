const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const router = express.Router();

// DELETE A REVIEW IMAGE

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const deleteImage = await ReviewImage.findByPk(req.params.imageId);
   
    if (!deleteImage) {
        const err = new Error("Review Image couldn't be found");
        err.status = 404;
        return res.json({ message: "Review Image couldn't be found" }, err.status);
    };

    const review = await Review.findByPk(deleteImage.id);

    if (parseInt(review.userId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    await deleteImage.destroy();
    return res.json({ message: "Successfully deleted" });
});



module.exports = router;