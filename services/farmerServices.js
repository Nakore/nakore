/**
 * This is the farmer service
 */
const Farmer = require('../models/farmerModel'); //Farmer model
const Order = require('../models/transaction')

function refCode(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

//Register a new Farmer for USSD Access
exports.createFarmer = [async (req, res)=> {
    try {
        const { first_name, last_name, phone } = req.body;
        const farmer = await Farmer.findOne({phone: phone}); //Checking database if user already exists

        if (farmer) {
            res.status(400).send('A farmer already exsist with this data...');

        } else {
            const newFarmer = new Farmer({
                first_name,
                last_name,
                phone,
                pin
            });
            await newFarmer.save();
            res.status(201).send('Farmer registered successfully.')
        }
    } catch (err) {
        res.status(500).send('Service not available at the moment, please try again in 15mins...');
    }
}]

exports.getFarmers = [ async (req, res) => {
    try {
        const farmers = await Farmer.find({})
        res.status(200).json({"farmers": farmers})
    } catch (err) {
        console.log(err);
    }    
}]

exports.createOrder = [ async (req, res) => {
    try {
        const { product, phone, state, lga, qty, amount, id } = req.body;
        const order = await Order.findOne({transactionId: id});
        if (order) {
            res.status(200).send("Order completed")
        } else {
            const newOrder = new Order({
                transactionId: refCode(4, "123456"),
                product,
                qty,
                state,
                amount,
                lga,
                phone
            })
            await newOrder.save()
            res.status(201).send("Order Successful");
        }

    } catch (err) {
        console.log(err);
    }
}]
