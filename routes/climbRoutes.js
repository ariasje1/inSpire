const express = require('express');
const router = express.Router();
const climbRoutes = require('../controllers/climbRoutes');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateClimbRoute, isAuthor } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const ClimbRoute = require('../models/climbRoute');

router.route('/')
    .get(catchAsync(climbRoutes.index))
    .post(isLoggedIn, upload.array('images'), validateClimbRoute, catchAsync(climbRoutes.createClimbRoute))


router.route('/new')
    .get(isLoggedIn, climbRoutes.renderNewForm);

router.route('/:id')
    .get(catchAsync(climbRoutes.showClimbRoute))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateClimbRoute, catchAsync(climbRoutes.updateClimbRoute))
    .delete(isLoggedIn, isAuthor, catchAsync(climbRoutes.deleteClimbRoute))

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(climbRoutes.renderEditForm));

module.exports = router;