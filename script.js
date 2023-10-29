import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
    databaseURL: "https://realtime-database-cf377-default-rtdb.asia-southeast1.firebasedatabase.app"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

const inputEl = document.querySelector("#input");
const fromEl = document.querySelector("#input-1");
const toEl = document.querySelector("#input-2");
const btnEl = document.querySelector("#btn");
const cardEl = document.querySelector("#card");

btnEl.addEventListener("click", function () {
    let inputValue = inputEl.value;
    let fromValue = fromEl.value;
    let toValue = toEl.value;

    push(endorsementsInDB, {
        endorsement: inputValue,
        from: fromValue,
        to: toValue,
    });

    clearInput();
});


onValue(endorsementsInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearCard();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];

            addEndorsements(currentItem);
        }
    } else {
        cardEl.textContent = "Empty!";
    }
});

function clearInput() {
    inputEl.value = "";
    fromEl.value = "";
    toEl.value = "";
}

function clearCard() {
    cardEl.textContent = "";
}

function addEndorsements(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");
    let from = document.createElement("h4");
    from.textContent = `From ${itemValue.from}`;
    let to = document.createElement("h4");
    to.textContent = `To ${itemValue.to}`;

    let endorsement = document.createElement("p");
    endorsement.textContent = itemValue.endorsement;

    newEl.appendChild(to);
    newEl.appendChild(endorsement);
    newEl.appendChild(from);

    newEl.addEventListener("click", function () {
        let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`);

        remove(exactLocationOfItemInDB);
    });

    cardEl.appendChild(newEl);
}
