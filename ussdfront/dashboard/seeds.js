const Products = require ('../../models/productModel');
const transaction = require('../../models/transaction');
const client = require("twilio")(process.env.accountSid, process.env.authToken);

let sessions = {};

function refCode(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

module.exports = menu => {
    menu.state("home.seed", {
        run: async () => {
            const input = await Products.find({category: "Seed"});            
            let seeds="";            
            for(let i=0; i< input.length; i++){
                seeds += (`\n`+[i.toString()]+" : "+ input[i]["title"]); 
            }
            menu.con(`Seedlings available:`+
                `${seeds}`
            );
            },
            next: {
            '0': 'home.seed.faro',
            '1': 'home.seed.hybrid',
            '2': 'home.seed.oba',
        },
        defaultNext: "invalidOption",
    });

    //Select Faro
    menu.state('home.seed.faro', {
        run: async () => {
            const{val} = menu;   
            sessions["product"] = val;
            let seed =[];
            
            const input = await Products.find({category: "Seed"});
            
            for(let i=0; i< input.length; i++){
               seed.push(input[i]["title"]);
            } 
            sessions["Desc"] = seed[0].toString();          
            menu.con(`How many ${seed[0]} do you want?`);
        },
        next: {
            "*\\d":"home.seed.select.state",
        },
        defaultNext: "invalidOption",
    });

    
    //Select Seed Co Maize Hybrid
    menu.state('home.seed.hybrid', {
        run: async () => {
            const { val } = menu;
            const input = await Products.find({category: "Seed"});
            let seed =[];
            for (let i=0; i< input.length; i++) {
                seed.push(input[i]["title"]);
            }
            
            sessions["product"] = val
            sessions["Desc"] = seed[1].toString();
            menu.con(`How many ${seed[1]} do you want?`);
        },
        next: {
            "*\\w":"home.seed.select.state",
        },
        defaultNext: "invalidOption",
    });

    //Select Seed Oba
    menu.state('home.seed.oba', {
        run: async () => {
            const { val } = menu;
            let seed =[];            
            sessions["product"] = val;            
            const input = await Products.find({category: "Seed"});
            
            
            for(let i=0; i< input.length; i++){
                seed.push(input[i]["title"]);
            }
            sessions["Desc"] = seed[2].toString();
            menu.con(`How many ${seed[2]} do you want?`);
        },
        next: {
            "*\\w":"home.seed.select.state",
        },
        defaultNext: "invalidOption",
    });

    //Choose State
    menu.state('home.seed.select.state', {
        run: async () => {
            const {val } = menu;
            sessions["qty"] = val;
            
            menu.con("Please enter State");           
        },
        next: {
            "*\\w":"home.seed.select.lga"

        },
        defaultNext: "invalideOption",
    });
    //Choose State
    menu.state('home.seed.select.lga', {
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
            "*\\w":"home.seed.select.lga.summary"
        },
        defaultNext: "invalideOption",
    });

    menu.state('home.seed.select.lga.summary', {
        run: async () => {
            const { val, args: { phoneNumber }} = menu;
            sessions["lga"] = val;
            const qty = sessions.qty;
            const desc = sessions.Desc;
            const selectedProduct = sessions.product;
            if (selectedProduct === "0") {
                const total= qty * 1200;
                sessions["total"] = total;
                menu.con(`Summary: `+
                `\n${qty} `+`${desc} x N1,200.00/kg = 
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
                `\n${qty} `+`${desc} x N2,000.00/kg = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`
                );
            }
           
        },
        next: {
            "1": "home.seed.pay",
            "2":"home.chemical.pay"
        },
        defaultNext: "invalidOption",

    })

    //Payment
    menu.state('home.seed.pay',{
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