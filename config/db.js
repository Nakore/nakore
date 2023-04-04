const { default: mongoose } = require('mongoose');
const { DATABASE_LIVE } = process.env;


exports.connect = () => {
    mongoose.set('strictQuery', false)
    .connect(DATABASE_LIVE, {
        useNewUrlParser: true,
    })    
    .then(()=> {
        console.log('Database Connection Successful');
    })
    .catch((err)=> {
        console.log('Database Connection Failed');
        process.exit(1);
    })
}