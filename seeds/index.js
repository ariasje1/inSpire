const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const ClimbRoute = require('../models/climbRoute');

mongoose.connect('mongodb://localhost:27017/inSpire');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await ClimbRoute.deleteMany({});
    
    const images = [
        {
            url: 'https://res.cloudinary.com/dldmgebsf/image/upload/v1775275258/photo-1657586552756-6bea281c76dd_rnmmwr.avif',
            filename: 'photo-1657586552756-6bea281c76dd_rnmmwr'
        },
        {
            url: 'https://res.cloudinary.com/dldmgebsf/image/upload/v1775275246/photo-1590122401811-94c46f70fb97_yiu8oq.avif',
            filename: 'photo-1590122401811-94c46f70fb97_yiu8oq'
        },
        {
            url: 'https://res.cloudinary.com/dldmgebsf/image/upload/v1775275231/photo-1696354659164-9e569dfed6c3_yhr1rt.avif',
            filename: 'photo-1696354659164-9e569dfed6c3_yhr1rt'
        }
    ];
    
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const climbRoute = new ClimbRoute({
            author: '69ce10fd5b42718c71f2a961',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [sample(images), sample(images)]
        });
        await climbRoute.save();
    }
};


seedDB().then(() => {
    mongoose.connection.close();
});