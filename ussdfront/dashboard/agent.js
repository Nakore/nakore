const UssdMenu = require('ussd-menu-builder');
const _ = require('lodash');

const Order = require('../../models/transaction');

let sessions = {};

module.exports = menu => {
menu.state('home.find', {
    run: async () => {
        const { val } =menu;
        sessions["ref"] = val;
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
        const id = sessions.ref;
        console.log("val:", val);
        console.log(id);
        const order = await Order.findOne({transactionId: val});
        if(order){            
            menu.con("Order Details: "+
            `\n${order.product}`+
            `\n${order.quantity}`+
            `\nPayment Due: ${order.amount}`+
            `\nPayment Status: ${order.paymentStatus}`+
            "\n1. Confirm Cash"+
            "\n2. Back"
            );
        } else {
            menu.end("Invalid refcode");
        }

    },
    next: {
        "1":"home.find.validate",
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