const { round } = require('lodash');
const Products = require ('../../models/productModel');
const sessions = {};
module.exports = menu => {
    //Nakore Chemical Listing Menu
    menu.state("home.chemical", {
        run: async () => {
            const {val, args: { phoneNumber }} = menu;
            const input = await Products.find({category: "Herbicide"});
            let herbicide =[];
            
            for(let i=0; i< input.length; i++){
                herbicide.push(`\n`+(i+1).toString()+`. ` +input[i]["title"]);
                
            }
            menu.con(`Chemicals available:`+
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
            const input = await Products.find({category: "Herbicide"});
            let herbicide =[];
            for(let i=0; i< input.length; i++){
                herbicide.push(input[i]["title"]);
            }
            const {
                val
            } = menu;
            const roundup = JSON.parse(val);         
                menu.con(`How many ${herbicide[0]} do you want?`);
           
        },
        next: {
            "*\\d":"home.round.pay",
        },
        defaultNext: "invalidOption",
    });
    //Roundup Atrazine Selection
    menu.state('home.chemical.atrazine', {
        run: async () => {
            const input = await Products.find({category: "Herbicide"});
            let herbicide =[];
            for(let i=0; i< input.length; i++){
                herbicide.push(input[i]["title"]);
            }
            const {
                val
            } = menu;
            sessions["atrazine"] = val;     
                menu.con(`How many ${herbicide[1]}`);
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
            for(let i=0; i< input.length; i++){
                herbicide.push(input[i]["title"]);
            }
            const {
                val,
                args: { phoneNumber }
            } = menu;
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