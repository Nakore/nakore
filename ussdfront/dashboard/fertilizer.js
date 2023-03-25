const Products = require ('../../models/productModel');
const ProductService = require('../../services/productService');

module.exports = menu => {
    menu.state("home.fertilizer", {
        run: async () => {
            const input = await Products.find({category: "Fertilizer"});
            let fertilizer =[];
            let num;
            //let products = seeds["products"];
            for(let i=0; i< input.length; i++){
                fertilizer.push(input[i]["title"]);
             }
            menu.con(`Fertilizers available:`+
                `${fertilizer}`
            );
            },
            next: {
                "1":"home.fertilizer.super"
                
        },
        defaultNext: "invalidOption",
    });

    menu.state('home.fertilizer.super', {
        run: async () => {
            const input = await Products.find({category: "Fertilizer"});
            let fertilizer =[];
            for(let i=0; i< input.length; i++){
                fertilizer.push(input[i]["title"]);
            }
            const {
                val
            } = menu;
            const roundup = JSON.parse(val);         
                menu.con(`How many ${fertilizer[0]} do you want?`);
           
        },
        next: {
            "*\\d":"home.fertilizer.pay",
        },
        defaultNext: "invalidOption",
    });

    menu.state('home.fertilizer.pay', {
        run: async () => {
            const input = await Products.find({category: "Fertilizer"});
            let fertilizer =[];
            for(let i=0; i< input.length; i++){
                fertilizer.push(input[i]["title"]);
            }
            const {
                val,
                args: { phoneNumber }
            } = menu;
                qty = JSON.parse(val)
                const total = qty * 11200
                menu.con(`Total: ${qty} x 12,200 = 
                N${total}. Proceed to payment?`+
                `\n1. Cash`+
                `\n2. Wallet`+
                `\n3. Airtime`);
    
        },
        next: {
            "2":"home.chemical.pay"
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