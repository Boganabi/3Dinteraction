
let cards = document.getElementById("cards");

let li = document.createElement("li");
var insertion;

insertion = document.createElement('div');
insertion.innerHTML = `
    <div class="row">
        <div class="column">
            <div class="card" id="cardSelection">
                <img src="img_avatar.png" alt="avatar" style="width:100%">
                <div class="container">
                    <h4><b>Name2</b></h4>
                    <p>Description2</p>
                </div>
            </div>
        </div>
    </div>`;

li.addEventListener("click", function () {
    console.log("load model on other page");
});
cards.appendChild(li);

li.appendChild(insertion);

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

const card = document.getElementById("cardSelection");
card.addEventListener("click", function () {
    // get index of clicked element and send to other js file to load the corresponding file
    console.log("working");
});

// when a model is uploaded we can use appendChild() on the ul id of cards