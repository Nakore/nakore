const transaction = require("../models/transaction");
const axios = require("axios")
const { v4: uuidv4 } = require('uuid');
const { response } = require("express");
//Paystack Integration

exports.paystackBank = [ async(req, res) => {
    try {        
        const url = `https://api.paystack.co/transaction/initialize`
        
        const response = await axios({
            url,
            data: {
                email: req.body.email,
                amount: req.body.amount,
                reference: uuidv4()
            },
            method: "post",
            headers: {
                "Content-Type":"application/json",
                Accept: "application/json",
                Authorization: `${process.env.SECRET_KEY}`
            }
        })
        res.status(200).json(response.data);
        console.log(response.data);

    } catch (err) {
        console.log(err);
    }
}]

const verify = async (reference) => {
    try {
        const url = `https://api.paystack.co/transaction/verify/${reference}`
        const response = await axios({
            url,
            reference,
            method: "get",
            Authorization: process.env.SECRET_KEY
        })

        console.log(response);
    } catch (err) {
        console.log(err);
    }
}

exports.transactions = [ async(req, res) => {
    const response = await transaction.find({}).sort({_id: -1});
    if (response) {
        res.status(200).json({'transactions': response});
    } else {
        res.status(500).send("Infomation not available at the momement");
    }    

}]

//Sum Of Total NGN Transaction
exports.Total = [ async(req, res) => {
    const response = await transaction.aggregate([
        {$match: {currency: "NGN"} },
        {$group: {
          _id: "transactionId",
          total: {
            $sum: "$amount"
          }
        }},
        {$sort: {total: -1}}
    ], function(err, result){
        console.log(result);
        
    })
    res.status(200).json({"total": response});

}]

//Sum of Pending Transaction
exports.totalPendingTransaction = [ async(req, res) => {
    const response = await transaction.aggregate([
        {$match: {paymentStatus: "pending"}},
        {$match: {
          _id: "transactionId",
          total: {
            $sum: "$amount"
          }
        }},
        {$sort: {total: -1}}
    ], function(err, result) {
        console.log(result);
    })
    res.status(200).json({"total": response});
}]
//Sum of Completed Transaction
exports.totalCompletedTransaction = [ async(req, res) => {
    const response = await transaction.aggregate([
        {$match: {paymentStatus: "successful"}},
        {$match: {
          _id: "transactionId",
          total: {
            $sum: "$amount"
          }
        }},
        {$sort: {total: -1}}
    ], function(err, result) {
        console.log(result);
    })
    res.status(200).json({"total": response});
}]

exports.transaction = [ async (req, res) => {
    const response = await transaction.findOne({transactionId: req.body.transactionId});
    if (response) {
        res.status(200).json(response);
    } else {
        res.status(500).json("Request failed");
    }
}]

/* exports.createTransaction = [ async (req, res) => {
    const {id, product, total, state, lga, phone} = req.body;
    const order = new transaction.create({

    })
}] */
