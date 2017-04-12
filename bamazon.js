/**
 * Created by blair on 4/6/17.
 */

var mysql      = require('mysql');
var inquirer   = require('inquirer');
var current_item = "";
var item_price = 0;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'great_bay',
    port: '3306'
});

connection.connect();

bayselect();


function bid()
{
 // listings();

        inquirer.prompt([

            {
                name: "idselect",
                message: "What item ID do you want to bid on?"
            }
        ]).then(function (answers) {
            console.log("You selected item #" + answers.idselect);

            connection.query('SELECT * FROM items ', function (error, results, fields) {
                if (error) throw error;
                var idgrabber = answers.idselect - 1;
                console.log("Item name: " + results[idgrabber].name + "  Type: " + results[idgrabber].type +  " Price: $" + results[idgrabber].price );
                // bayselect();
                current_item = results[idgrabber].name;
                item_price = results[idgrabber].price;

                inquirer.prompt([

                    {
                        name: "bidamount",
                        message: "How much do you want to bid on " + current_item + "?"
                    }
                ]).then(function (answers)
                {
                    if (item_price > answers.bidamount)
                    {
                        console.log("fuck you cheapskate, way too low.");
                    }


                });



            });


        });

}


// this is where they're prompted to choose their action
function bayselect()
{
    inquirer.prompt([
        {
            name: "actionchoice",
            message: "Which do you want to do? \n BID [1] \n  POST [2]\n LISTINGS [3] \n QUIT [4]",
        }, ])
        .then(function (answers) {
        console.log("choice selected: " + answers.actionchoice);
        if (answers.actionchoice == 1)
        {
            console.log("You've selected BID.")
            bid();
        }
        if (answers.actionchoice == 2)
        {
            console.log("You've selected POST.")
            additem();
        }
        if (answers.actionchoice == 3)
        {
                console.log("You've selected LISTINGS.")
                listings();
        }
            if (answers.actionchoice == 4)
                {
                    connection.end();
                }


        //
        // else if (answers.actionchoice !== 1 && answers.actionchoice !== 2 && answers.actionchoice !== 3)
        // {
        //     console.log("Sorry, try again... \n");
        //   bayselect();
        // }
    });
};



function listings() {
    connection.query('SELECT * FROM items ', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        bayselect();
    });
};












//
//
// inquirer.prompt([
//
//     {name: "adam", message: "What is Adam's favorite drink?"},
//     {name: "bob", message: "What drink does Bob love?"},
//     {name: "phil_mckracken", message: "What does Phil drink?"}
//
//
//     ]).then(function (answers) {
// console.log(answers);
//
// if (answers.phil_mckracken = "beer")
// {
//     console.log("Phil is a drunk. Very sad.");
// }
// else {
//     console.log("We do not like Phil");
// }
//
// });
//
//







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
        }])
        .then(function (answers) {
        console.log(answers);
        connection.query("INSERT INTO items SET ?", {
            name: answers.name,
            type: answers.type,
            price: answers.price
        }, function(err, res) {
            console.log(err);
        });

       bayselect();

    });
};