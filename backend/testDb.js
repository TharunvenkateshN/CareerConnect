const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

console.log('Testing DB Access...');
console.log('URI:', process.env.MONGODB_URI ? 'Defined' : 'Missing');

if (!process.env.MONGODB_URI) process.exit(1);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected Successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection Failed:', err);
        process.exit(1);
    });
