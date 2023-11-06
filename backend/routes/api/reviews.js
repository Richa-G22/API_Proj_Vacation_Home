const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Review, Spot, User, ReviewImage, SpotImage, Sequelize } = require('../../db/models');
const router = express.Router();

const validateReview = [
    check('stars')
      .not()
      .isEmpty()
      .isInt({ min: 1})
      .withMessage('Stars must be an integer from 1 to 5')
      .isInt({ max: 5})
      .withMessage('Stars must be an integer from 1 to 5'),
    check('review')
      .not()
      .isEmpty()
      .withMessage('Review text is required'),
    handleValidationErrors
  ]; 

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
    
	let reviews = await Review.findAll({
        where: {
            userId: req.user.id,
            
        },
        include: [
            {
                model: User,
                attributes: ['id','firstName','lastName'], 
        },
            {
                model: Spot,
                attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price'], 
                include: [
                    {
                        model: SpotImage,
                        attributes: [],
                    },
                ]   
            }, 
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            },
        ],
        attributes: {
            include: [  
                [Sequelize.col('Spot.SpotImages.url'), 'previewImage'] 
            ]
        }, 
        group: ['Review.id', 'User.id', 'ReviewImages.id','Spot.SpotImages.url', 'Spot.id']
    });
    
    let reviewList = [];
    reviews.forEach(review => {
        let review_ = review.toJSON();
        if (review_['Spot']['lat']) {
            review_['Spot']['lat'] = parseFloat(review_['Spot']['lat'])
        };
        if (review_['Spot']['lng']) {
            review_['Spot']['lng'] = parseFloat(review_['Spot']['lng'])
        };
        if (review_['Spot']['price']) {
            review_['Spot']['price'] = parseFloat(review_['Spot']['price'])
        };
         
        review_['Spot']['previewImage'] = review_.previewImage;
        delete review_.previewImage;
        reviewList.push(review_);
     });
   return res.json({"Reviews": reviewList});
});


// Get all Reviews by a Spot's id
router.get("/current", requireAuth, async (req, res) => {
    
	const reviews = await Review.findAll({
        where: {
            userId: req.user.id,
        },
        include: [
            {
                model: User,
                attributes: ['id','firstName','lastName'],
        },
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
            }, 
       
        {
                model: ReviewImage,
                attributes: ['id','url'],
        }, 
        ],
 
        group: ['Review.id']
    });

	return res.json({"Reviews": reviews});
});










// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images",requireAuth, async (req, res) => {
    const reviewId  = req.params.reviewId;
    const review = await Review.findByPk(reviewId);

    if (!review) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return res.json({ message: "Review couldn't be found" }, err.status);
    };

    if (parseInt(review.userId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status) 
    } else {
        const existingImages = await ReviewImage.findAll({
            where: { 
                reviewId: req.params.reviewId
             },    
        });
        if (existingImages.length < 10 ){
            const { url } = req.body;    
            const newImage = await ReviewImage.create({ reviewId, url });
    
            const imgRes = {};
            imgRes.id = newImage.id;
            imgRes.url = newImage.url;
            return res.json(imgRes);
        } else {
            return res.status(403).json({ message: "Maximum number of images for this resource was reached" })
        }
    };    
});


// Edit a Review
router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
    const { review, stars } = req.body;
    const reviewId  = req.params.reviewId;

    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return res.json({ message: "Review couldn't be found" }, err.status);
    };

    if (parseInt(existingReview.userId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };
 
    existingReview.review = review;
    existingReview.stars = stars;

    await existingReview.save();
    return res.json( existingReview );
});


// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const deleteReview = await Review.findByPk(req.params.reviewId);
   
    if (!deleteReview) {
        const err = new Error("Review couldn't be found");
        err.status = 404;
        return res.json({ message: "Review couldn't be found" }, err.status);
    };

    if (parseInt(deleteReview.userId) !== parseInt(req.user.id)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return res.json({ message: "Forbidden" }, err.status); 
    };

    await deleteReview.destroy();
    return res.json({ message: "Successfully deleted" });
})

module.exports = router;