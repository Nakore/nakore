const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        transactionId: {
            required: [true, "transactionId is Missing"],
            type: String,
            trim: true,
        },
        state: {
            required: true,
            type: String,
            trim: true,
        },
        lga: {
            required: true,
            type: String,
            trim: true,
        },
        email: {
            type: String,            
            trim: true,
        },
        phone: {
            type: String,
            required: true,
        },
        product: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: [true, "amount is require"],
        },
        quantity:{
            type: Number,
            required: [true, "Quantity is required"]
        },
        currency: {
            type: String,
            enum: ["NGN", "USD", "EUR", "GBP"],
            required: [true, "Currncy is required"],
            default: "NGN",
        },
        paymentStatus: {
            type: String,
            enum: ["successful","pending","failed"],
            default: "pending",
        },
        paymentGateway: {
            type: String,
            enum: ["flutterwave"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);