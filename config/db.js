const { default: mongoose } = require('mongoose');
const { DATABASE_URL } = process.env;


exports.connect = () => {
    mongoose.set('strictQuery', false)
    .connect(DATABASE_URL, {
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