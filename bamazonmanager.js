/**
 * Bamazon Manager App. Created by Blair Erickson on 4/6/17.
 */

var mysql      = require('mysql');
var inquirer   = require('inquirer');
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



// this is where they're prompted to choose their action and then triggers the subsequent function
function bamselect()
{
    inquirer.prompt([
        {
            name: "actionchoice",
            message: "Welcome Bamazon Manager. \n What do you want to do? \n[1] - ADD NEW ITEM\n[2] - FULL PRODUCT LISTINGS \n[3] - LOW STOCK LISTINGS \n[4] - REPLENISH STOCK \n[5] - QUIT\n select:",
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
                console.log("You've selected FULL PRODUCT LISTINGS.")
                listings();
        }
        if (answers.actionchoice == 3)
            {
                console.log("You've selected LOW STOCK.")
                lowstock();
            }
         if (answers.actionchoice == 4)
            {
                console.log("You've selected REPLENISH STOCK.")
                updatestock();
            }
         if (answers.actionchoice == 5)
            {
                connection.end();
            }

         if (answers.actionchoice != 1 && answers.actionchoice != 2 && answers.actionchoice != 3 && answers.actionchoice != 4 && answers.actionchoice != 5)
            {
                console.log ("Not a choice, try again.");
                bamselect();
            }

    });
};


// lists all items in database
function listings() {
    connection.query('SELECT * FROM items ', function (error, results, fields) {
        if (error) throw error;
        for(i=0;i<results.length;i++){
            console.log("ID #" + results[i].item_id + "  Item name: " + results[i].product_name + "  price: $" + results[i].price + "  type: " + results[i].department_name + "  stock: " + results[i].stock_quantity);
        }
        bamselect();
    });
};

// does a check of any items where stock is less than 5 and lists them.
function lowstock() {
    connection.query('SELECT * FROM items WHERE stock_quantity < 5', function (error, results, fields) {
        if (error) throw error;
        for(i=0;i<results.length;i++){
            console.log("ID #" + results[i].item_id + "  Item name: " + results[i].product_name + "  price: $" + results[i].price + "  type: " + results[i].department_name + "  stock: " + results[i].stock_quantity);
        }
        bamselect();
    });
};



// adds to the total stock of an item
function updatestock()
{
        inquirer.prompt([
            {
                name: "actionchoice",
                message: "\n What is the ID of the item you want to add stock to? \n ID:",
            }, ])
            .then(function (answers) {
                console.log("ID# selected: " + answers.actionchoice);
                id = answers.actionchoice;
                connection.query('SELECT * FROM items WHERE item_id =' + id, function (error, results, fields) {
                if (error) throw error;
                console.log("ID #" + results[0].item_id + "  Item name: " + results[0].product_name + "  price: $" + results[0].price + "  type: " + results[0].department_name + "  stock: " + results[0].stock_quantity);
                inventory = results[0].stock_quantity;
                inquirer.prompt([
                    {
                        name: "actionchoice",
                        message: "How many do you want to add? \n Amount:",
                    }, ])
                .then(function (answers) {
                   inventory = inventory + parseInt(answers.actionchoice);
                   connection.query('UPDATE items SET stock_quantity=' + inventory + ' WHERE item_id = ' + id, function (error, results, fields) {
                                if (error) throw error;
                                console.log(inventory + " left in stock.");
                                listings();
                            });
                            });
                        });

                 });
    };



// adds a new item into the database.
function additem() {
    inquirer.prompt([
        {
            name: "name",
            message: "Add a new item to the database. What's the item name? \n NAME: "
        }, {
            name: "department",
            message: "What department does the item go in? DEPARTMENT:"
        }, {
            name: "price",
            message: "How much are you selling it for to start with? PRICE:"
        },{
            name: "stock",
            message: "How many of the item do we have? STOCK:"
        }])
        .then(function (answers) {
        connection.query("INSERT INTO items SET ?", {
            product_name: answers.name,
            department_name: answers.department,
            stock_quantity: answers.stock,
            price: answers.price
        }, function(err, res) {
            console.log(err);
        });
            listings();
            bamselect();


    });
};