/**
 * Bamazon Manager App. Created by Blair Erickson on 4/6/17.
 */

var mysql      = require('mysql');
var inquirer   = require('inquirer');
var prompt   = require('prompt');
var current_item = "";
var item_price = 0;
var inventory = 0;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'bamazon',
    port: '3306'
});

connection.connect();

bamselect();



// this is where they're prompted to choose their action
function bamselect()
{
    inquirer.prompt([
        {
            name: "actionchoice",
            message: "Welcome Bamazon Manager. \n What do you want to do? \n[1] - ADD NEW ITEM\n[2] - CHECK STOCK LISTINGS \n[3] - QUIT",
        }, ])
        .then(function (answers) {
        console.log("choice selected: " + answers.actionchoice);
        if (answers.actionchoice == 1)
        {
            console.log("You've selected ADD ITEM.")
            additem();
        }
        if (answers.actionchoice == 2)
        {
                console.log("You've selected STOCK LISTINGS.")
                listings();
        }
        if (answers.actionchoice == 3)
                {
                    connection.end();
                }



        // else  (answers.actionchoice !== 1 && answers.actionchoice !== 2 && answers.actionchoice !== 3)
        // {
        //     console.log("Sorry, try again... \n");
        //   bamselect();
        // }
    });
};



function listings() {
    connection.query('SELECT * FROM items ', function (error, results, fields) {
        if (error) throw error;
        for(i=0;i<results.length;i++){
            console.log("ID #" + results[i].id + "  Item name: " + results[i].name + "  price: $" + results[i].price + "  type: " + results[i].type + "  stock: " + results[i].stock);
        }
        bamselect();
    });
};


function additem() {
    inquirer.prompt([
        {
            name: "name",
            message: "Add a new item to the database. What's the title? \n TITLE: "
        }, {
            name: "type",
            message: "What type of item is it? TYPE:"
        }, {
            name: "price",
            message: "How much are you selling it for to start with? PRICE:"
        },{
            name: "stock",
            message: "How many of the item do we have? STOCK:"
        }])
        .then(function (answers) {
        console.log(answers);
        connection.query("INSERT INTO items SET ?", {
            name: answers.name,
            type: answers.type,
            stock: answers.stock,
            price: answers.price
        }, function(err, res) {
            console.log(err);
        });

       bamselect();

    });
};