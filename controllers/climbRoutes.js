const ClimbRoute = require('../models/climbRoute');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const climbRoutes = await ClimbRoute.find({});
    res.render('climbRoutes/index', { climbRoutes })
}

module.exports.renderNewForm = (req, res) => {
    res.render('climbRoutes/new');
}

module.exports.createClimbRoute = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.climbRoute.location,
        limit: 1
    }).send();
    const climbRoute = new ClimbRoute(req.body.climbRoute);
    climbRoute.geometry = geoData.body.features[0].geometry;
    climbRoute.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    climbRoute.author = req.user._id;
    await climbRoute.save();
    req.flash('success', 'Successfully added a new climbing route!');
    res.redirect(`/climbRoutes/${climbRoute._id}`)
}

module.exports.showClimbRoute = async (req, res) => {
    const climbRoute = await ClimbRoute.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!climbRoute) {
        req.flash('error', 'Cannot find that climbing route!');
        return res.redirect('/climbRoutes');
    }
    res.render('climbRoutes/show', { climbRoute });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const climbRoute = await ClimbRoute.findById(id);
    if (!climbRoute) {
        req.flash('error', 'Cannot find that climbing route!');
        return res.redirect('/climbRoutes');
    }
    res.render('climbRoutes/edit', { climbRoute });
}

module.exports.updateClimbRoute = async (req, res) => {
    const { id } = req.params;
    const climbRoute = await ClimbRoute.findByIdAndUpdate(id, { ...req.body.climbRoute }, { returnDocument: 'after' });
    const geoData = await geocoder.forwardGeocode({
        query: req.body.climbRoute.location,
        limit: 1
    }).send();
    climbRoute.geometry = geoData.body.features[0].geometry;
    if (req.files && req.files.length > 0) {
        const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        climbRoute.images.push(...images);
    }
    await climbRoute.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await climbRoute.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated climbing route!');
    res.redirect(`/climbRoutes/${climbRoute._id}`);
}

module.exports.deleteClimbRoute = async (req, res) => {
    const { id } = req.params;
    await ClimbRoute.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted climbing route!');
    res.redirect('/climbRoutes');
}