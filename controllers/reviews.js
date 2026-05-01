const ClimbRoute = require('../models/climbRoute');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const climbRoute = await ClimbRoute.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    climbRoute.reviews.push(review);
    await review.save();
    await climbRoute.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/climbRoutes/${climbRoute._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await ClimbRoute.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!');
    res.redirect(`/climbRoutes/${id}`);
}