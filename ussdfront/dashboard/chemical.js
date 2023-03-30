const { round } = require('lodash');
const Products = require ('../../models/productModel');

let sessions = {};

function refCode(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
module.exports = menu => {
    //Nakore Chemical Listing Menu
    menu.state("home.chemical", {
        run: async () => {
            const { val, args: { phoneNumber }} = menu;
            const chemical = await Products.find({category: "Herbicide"});
            let herbicide =[];
            
            for(let i=0; i < chemical.length; i++){
                herbicide.push(`\n`+(i+1).toString()+`. ` +chemical[i]["title"]);                
            }
            menu.con(`Available chemicals :`+
                `${herbicide}`
            );
            },
            next: {
            "1":"home.chemical.roundup",
            "2":"home.chemical.atrazine"
            
        },
        defaultNext: "invalidOption",
    });

    //Roundup Herbicide Selection
    menu.state('home.chemical.roundup', {
        run: async () => {
            const { val } = menu;
            sessions["product"] = val;
            let herbicide = [];
            const chemical = await Products.find({category: "Herbicide"});
            for(let i=0; i< chemical.length; i++){
                herbicide.push(chemical[i]["title"]);
            }
            
            const roundup = JSON.parse(val);         
            menu.con(`Fertilizers available:`+
            `${seeds}`
            );
           
        },
        next: {
            "*\\d":"home.round.pay",
        },
        defaultNext: "invalidOption",
    });
    //Roundup Atrazine Selection
    menu.state('home.chemical.atrazine', {
        run: async () => {
            const { val } = menu;
            sessions["product"] = val;
            const input = await Products.find({category: "Herbicide"});
            let herbicide =[];
            for(let i=0; i< input.length; i++){
                herbicide.push(input[i]["title"]);
            }            
            sessions["atrazine"] = val;     
                menu.con(`How many ${herbicide[1]} do you want?`);
        },
        next: {
            "*\\d":"home.atraz.pay"
        },
        defaultNext: "invalidOption",
    });
    //Shopping Summary for Roundup Selection
    menu.state('home.round.pay', {
        run: async () => {
            const input = await Products.find({category: "Herbicide"});
            let herbicide =[];
            for(let i=0; i < input.length; i++){
                herbicide.push(input[i]["title"]);
            }
            const { val, args: { phoneNumber }} = menu;
                qty = JSON.parse(val)
                const total = qty * 1200
                menu.con(`Total: ${qty} x 1200 = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`+
                `\n2. Wallet`+
                `\n3. Airtime`);
    
        },
        next: {
            "\\d":"home.chemical.pay"
        },
        defaultNext: "invalidOption",
    });

    //Order Summry
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
                `\n1. Cash`+
                `\n2. Wallet`+
                `\n3. Airtime`
                );
            } else if ( selectedProduct === "1") {
                const total = qty * 3700;
                sessions["total"] = total;
                menu.con(`Summary: `+
                `\n${qty} `+`${desc} x N3,700.00/kg = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`+
                `\n2. Wallet`+
                `\n3. Airtime`
                );
            } else if ( selectedProduct === "2") {
                const total = qty * 2000;
                sessions["total"] = total;
                menu.con(`Summary: `+
                `\n${qty} `+`${desc} x N2,000.00/kg = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`+
                `\n2. Wallet`+
                `\n3. Airtime`
                );
            }
           
        },
        next: {
            "1": "home.seed.pay",
            "2":"home.chemical.pay"
        },
        defaultNext: "invalidOption",

    })

    //Shopping Summary for Roundup Selection
    menu.state('home.atraz.pay', {
        run: async () => {
            const input = await Products.find({category: "Herbicide"});
            let herbicide =[];
            for(let i=0; i< input.length; i++){
                herbicide.push(input[i]["title"]);
            }
            const {
                val,
                args: { phoneNumber }
            } = menu;
                qty = JSON.parse(val)
                const total = qty * 1200
                menu.con(`Total: ${qty} x 1800 = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`+
                `\n2. Wallet`+
                `\n3. Airtime`);
    
        },
        next: {
            "\\d":"home.chemical.pay"
        },
        defaultNext: "invalidOption",
    });
    

    menu.state('invalidOption', {
        run: () => {
            menu.end(`Invalid option`);
        },
    });
    return menu;
}