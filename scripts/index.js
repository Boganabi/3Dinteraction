
import { pg } from "/pg/lib/client";
// require(['node_modules/pg/lib/client'], function (require) {
//     console.log("loaded");
//     var pg = require('node_modules/pg/lib/client');
//     const connectionString = "postgres://postgres:Pw4admin@localhost:5432/postgres";

//     var pgClient = new pg.Client(connectionString);
//     pgClient.connect();

//     var query = pgClient.query("SELECT id from Customer where name = 'customername'");
//     query.on("row", function(row, result){
//         result.addRow(row);
//         console.log("pg loaded, and result is " + result);
//     });
// });

const connectionString = "postgres://postgres:Pw4admin@localhost:5432/postgres";

var pgClient = new pg.Client(connectionString);
pgClient.connect();

var query = pgClient.query("SELECT id from Customer where name = 'customername'");
query.on("row", function(row, result){
    result.addRow(row);
    console.log("pg loaded, and result is " + result);
});

let cards = document.getElementById("cards");

function addNewModelCard(name) {
    let li = document.createElement("li");
    li.className = "row";

    li.innerHTML = `
        <div class="column">
            <div class="card" id="cardSelection">
                <img src="assets/img/portfolio/safe.png" alt="preview" width="140" height="120">
                <div class="container">
                    <h4><b>` + name + `</b></h4>
                </div>
            </div>
        </div>`;


    li.addEventListener("click", function () {
        console.log("load model on other page");
        window.location.href = "modelViewer.html?name=" + name;
    });
    cards.appendChild(li);
}

addNewModelCard("fancyskull");
addNewModelCard("diamond");
// addNewModelCard("milw-ep2")

// const name = "milw-ep2"

//cards.appendChild(li);

/*
this is what will be added to our li object
<div class="column">
    <div class="card" id="cardSelection">
        <img src="img_avatar.png" alt="avatar" style="width:100%">
        <div class="container">
            <h4><b>Name2</b></h4>
            <p>Description2</p>
        </div>
    </div>
</div>
*/

// const card = document.getElementById("cardSelection");
// card.addEventListener("click", function () {
//     // get index of clicked element and send to other js file to load the corresponding file
//     console.log("working");
// });

// when a model is uploaded we can use appendChild() on the ul id of cards

function keyPressed(e) {

    switch(e.key){
        case 'b':
            
            console.log("spawned");
            break;
    }

    e.preventDefault();
}

document.addEventListener('keydown', keyPressed);

// in the database: model, name of model, author, potentially png?

// not sure if what we are trying to do is possible because code ran in a web browser cannot access anything outside of it

// this is only possible solution methinks https://www.tothenew.com/blog/connect-to-postgresql-using-javascript/ 
// turns out that does not work :/
// but this might https://acho.io/blogs/how-do-you-display-data-from-a-database-to-a-website 
// and this https://stackoverflow.com/questions/52612446/importing-a-package-in-es6-failed-to-resolve-module-specifier-vue 