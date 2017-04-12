/**
 * Created by blair on 4/6/17.
 */

var mysql      = require('mysql');
var inquirer   = require('inquirer');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'playlist_db',
    port: '3306'
});

connection.connect();

connection.query('SELECT * FROM music ' , function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    addsong();

});

function addsong() {
    inquirer.prompt([
        {
            name: "usertitle",
            message: "Add a new song to the database. What's the title? \n TITLE: "
        }, {
            name: "userartist",
            message: "Who's the artist? ARTIST:"
        }, {
            name: "usergenre",
            message: "What genre is the song? GENRE:"
        }]).then(function (answers) {
            console.log(answers);
        connection.query("INSERT INTO music SET ?", {
            title: answers.usertitle,
            artist: answers.userartist,
            genre: answers.usergenre
        }, function(err, res) {
            console.log(err);
        });

        connection.end();

    });
};

