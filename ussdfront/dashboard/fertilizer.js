const Products = require ('../../models/productModel');
const transaction = require('../../models/transaction');
//const client = require("twilio")(process.env.accountSid, process.env.authToken);

let sessions = {};

function refCode(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

module.exports = menu => {
    menu.state("home.fertilizer", {
        run: async () => {
            const input = await Products.find({category: "Fertilizer"});            
            let fertilizer="";            
            for(let i=0; i< input.length; i++){
                fertilizer += (`\n`+[i.toString()]+" : "+ input[i]["title"]); 
            }
            menu.con(`Available brands:`+
                `${fertilizer}`
            );
            },
            next: {
            '0': 'home.fertilizer.single'
            
        },
        defaultNext: "invalidOption",
    });

    //Select Faro
    menu.state('home.fertilizer.single', {
        run: async () => {
            const{val} = menu;   
            sessions["product"] = val;
            let fertilizer =[];
            
            const input = await Products.find({category: "Fertilizer"});
            
            for(let i=0; i< input.length; i++){
               fertilizer.push(input[i]["title"]);
            } 
            sessions["Desc"] = fertilizer[0].toString();          
            menu.con(`How many ${fertilizer[0]} do you want?`);
        },
        next: {
            "*\\d":"home.fertilizer.single.state",
        },
        defaultNext: "invalidOption",
    });

    
    

    //Choose State
    menu.state('home.fertilizer.single.state', {
        run: async () => {
            const {val } = menu;
            sessions["qty"] = val;
            
            menu.con("Please enter State");           
        },
        next: {
            "*\\w":"home.fertilizer.single.lga"

        },
        defaultNext: "invalideOption",
    });
    //Choose Local Government Area
    menu.state('home.fertilizer.single.lga', {
        run: async () => {
            const { val } = menu
            console.log(sessions.qty);
            sessions["state"] = val
            console.log("Entered value: " + val);
            if (val === "adamawa") {
                menu.con("Please enter your Local Government:");
            } else if (val === "Adamawa"){
                menu.con("Please enter your Local Government:");
            } else if (val === "Lagos"){
                menu.con("Please enter your Local Government:");
            } else if (val === "lagos"){
                menu.con("Please enter your Local Government:");
            }
            else {
                menu.end(`Our service hasn't reached your area yet.
                \nPlease call +2347033009900 to order`)
            }                       
        },
        next: {
            "*\\w":"home.fertilizer.single.lga.summary"
        },
        defaultNext: "invalideOption",
    });

    menu.state('home.fertilizer.single.lga.summary', {
        run: async () => {
            const { val, args: { phoneNumber }} = menu;
            sessions["lga"] = val;
            const qty = sessions.qty;
            const desc = sessions.Desc;
            const selectedProduct = sessions.product;
            if (selectedProduct === "0") {
                const total= qty * 12000;
                sessions["total"] = total;
                menu.con(`Summary: `+
                `\n${qty} `+`${desc} x N12,000.00 = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`
                );
            } else if ( selectedProduct === "1") {
                const total = qty * 3700;
                sessions["total"] = total;
                menu.con(`Summary: `+
                `\n${qty} `+`${desc} x N3,700.00/kg = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`
                );
            } else if ( selectedProduct === "2") {
                const total = qty * 2000;
                sessions["total"] = total;
                menu.con(`Summary: `+
                `\n${qty}`+`${desc} x N2,000.00/kg = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`
                );
            }
           
        },
        next: {
            "1": "home.fertilizer.pay",
            "2":"home.chemical.pay"
        },
        defaultNext: "invalidOption",

    })

    //Payment
    menu.state('home.fertilizer.pay',{
        run: async () => {

            console.log(sessions.total);
            console.log(sessions.lga)

            const { val, args:{phoneNumber} } = menu
            const transactionId = refCode(4, '01345678');
            const quantity = sessions.qty;
            const product = sessions.Desc;
            const amount = sessions.qty * 3200;
            const phone = phoneNumber;
            const lga = sessions.lga;
            const state = sessions.state;
            //Create and save transaction to database
            try {
                const invoice = new transaction({
                    transactionId, quantity, phone, product, amount, state, lga
                })
                await invoice.save();
                /* client.messages
                .create({body: `Your order ${transactionId} is ready for pick-up`, from: "+15673390650", to: phoneNumber})
                .then(message => console.log(message.status)); */
                menu.end(`Order completed`+
            `\n Ref: ${transactionId}`+
            `\n Pickup location to be shared via sms`);
            } catch (err) {
                menu.end("Sorry, transaction failed")
                console.log(err)
            }
            
        }
    })
    
    menu.state('invalidOption', {
        run: () => {
            menu.end(`Invalid option`);
        },
    });
    return menu;
}