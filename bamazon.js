/**
 * Bamazon Customer App. Created by Blair Erickson on 4/6/17.
 */

var mysql      = require('mysql');
var inquirer   = require('inquirer');
var current_item = "";
var item_price = 0;
var inventory = 0;
var id = 0;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bamazon',
    port: '3306'
});

connection.connect();

listings();



// this is where they're prompted to choose their action
function bamselect()
{
    console.log("----------------------------------------------------");
    inquirer.prompt([
        {
            name: "actionchoice",
            message: "Welcome to the Bamazon node store. \n What is the ID of the item you want to buy? \n Or enter 0 to quit. \n ID:",
        }, ])
        .then(function (answers) {
            if (answers.actionchoice == 0)
            {
                console.log("\n goodbye! \n");
                connection.end();
            }
            else {
                console.log("ID# selected: " + answers.actionchoice);
                id = answers.actionchoice;
                buyitem();
            }
    });
};

function buyitem()
{
    console.log("----------------------------------------------------");
    connection.query('SELECT * FROM items WHERE item_id =' + id, function (error, results, fields) {
        if (error) {
            console.log("Not a valid ID. \n")
        listings();
        }
        else {
            console.log("ID #" + results[0].item_id + "  Item name: " + results[0].product_name + "  price: $" + results[0].price + "  type: " + results[0].department_name + "  stock: " + results[0].stock_quantity);
            inventory = results[0].stock_quantity;
            item_price = results[0].price;
            inquirer.prompt([
                {
                    name: "actionchoice",
                    message: "How many do you want to buy? \n Amount:",
                },])
                .then(function (answers) {
                    inventory = inventory - answers.actionchoice;
                    if (inventory < 0) {
                        console.log("Not enough left in stock!");
                        listings();
                    }
                    else {
                        item_price = item_price * answers.actionchoice;
                        console.log("Total cost $" + item_price);
                        connection.query('UPDATE items SET stock_quantity=' + inventory + ' WHERE item_id = ' + id, function (error, results, fields) {
                            if (error) throw error;
                            console.log(inventory + " left in stock.");
                            listings();
                        });
                    }
                    ;
                });

        }

    });
};



function listings() {
    console.log("----------------------------------------------------");
    connection.query('SELECT * FROM items ', function (error, results, fields) {
        if (error) throw error;
        for(i=0;i<results.length;i++){
            console.log("ID #" + results[i].item_id + "  Item name: " + results[i].product_name + "  price: $" + results[i].price + "  type: " + results[i].department_name + "  stock: " + results[i].stock_quantity);
        }
        bamselect();
    });
};

