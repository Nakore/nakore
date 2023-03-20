const UssdMenu = require('ussd-menu-builder');
const _ = require('lodash');

const Order = require('../../models/transaction');

let sessions = {};

module.exports = menu => {
menu.state('home.find', {
    run: async () => {
        const { val } =menu;
        
        menu.con(`Provide Ref Code: `);

    },
    next: {
        "*\\w":"home.find.validate"
    },
    defaultNext: "invalidOption",
})

menu.state("home.find.validate", {
    run: async () => {
        const { val } = menu;
        sessions["ref"] = val;
        
        const order = await Order.findOne({transactionId: val});
        if(order){            
            menu.con("Order Details: "+
            `\n${order.product}`+
            `\nQuantity: ${order.quantity}`+
            `\nPayment Due: ${order.amount}`+
            `\nPayment Status: ${order.paymentStatus}`+
            "\n1. Confirm Cash"+
            "\n2. Back"
            );
        } else {
            menu.con("Invalid refcode"+
            "\n1. Back");
        }

    },
    next: {
        "1":"home.find.action",
        "2":"home.find"
    },
    defaultNext: "invalidOption",
})

menu.state("home.find.action", {
    run: async () => {
        const { val } = menu;
        const id = sessions.ref;
        try{
            const status = "Successful";
            const order = await Order.updateOne({transactionId: id}, {$set:{paymentStatus: status}});
            if(order){
                menu.end(`Order completed`);
            } else {
                menu.end("Confirmation failed");
            }
        }catch (err){
            console.log(err);
        }
        

    },
    next: {
        "1":"home.find.action",
        "2":"Change Pin"
    },
    defaultNext: "invalidOption",
})

menu.state('invalidOption', {
    run: () => {
        menu.end(`Invalid option`);
    },
});
return menu;
}