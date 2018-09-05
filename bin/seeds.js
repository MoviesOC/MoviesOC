const User = require('../models/User');
const mongoose = require('mongoose');

mongoose
    .connect(
        process.env.MONGODB_URI,
        { useNewUrlParser: true }
    )
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    })
    .catch(err => {
        console.error('Error connecting to mongo', err);
    });

User.create(users).then(usersFromDB => {
    console.log(usersFromDB.length + 'were created');
    mongoose.connection.close();
});
