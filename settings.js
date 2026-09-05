// Desktop layout
function desktopLayout() {
    let width = window.innerWidth;
    let barTop = document.getElementById("barTop");
    let barBottom = document.getElementById("barBottom");
    let body = document.getElementById("settingsPage");
    let buttonBack = document.getElementById("buttonBack");
    if (width >= 1000) {
        barTop.appendChild(barBottom);
        buttonBack.firstElementChild.style.display = "none";
    } else {
        body.appendChild(barBottom);
        buttonBack.firstElementChild.style.display = "";
    }
}

// Corrects layout for the first time
desktopLayout();

// EASTEREGG - AerusW mode, see index.js
let AerusW_mode = (localStorage.getItem("name") || "").trim() === "AerusW";

// Corrects layout every time a resize happens
window.addEventListener("resize", function(){
    desktopLayout();
})

// Reads buttons
let buttonBack = document.getElementById("buttonBack");
let buttonNameChange = document.getElementById("buttonNameChange");
let buttonListClear = document.getElementById("buttonListClear");


// Back button function
buttonBack.addEventListener("click", function(){
    window.location.href = "index.html";
});


// Change name button
buttonNameChange.addEventListener("click", function(){
    let newName = prompt("Inserisci il nuovo nome da utilizzare.");
    if (newName !== null) {
        localStorage.setItem("name", newName.trim());
        window.location.href = "index.html";
    };
});


// Clear list button
buttonListClear.addEventListener("click", function(){
    // EASTEREGG - the list is wiped on the first click, without asking
    if (AerusW_mode === false && confirm("Sei sicuro di voler eliminare l'intera lista? Questa azione è irreversibile.") === false) {
        return;
    };
    taskStore.clear();
    window.location.href = "index.html";
});

// Toggle for task deletion confirmation
let toggleDeleteConfirm = document.getElementById("toggleDeleteConfirm");
let tdcState = localStorage.getItem("confirmTaskDeletion");
if (tdcState === "true") {
   toggleDeleteConfirm.checked = true;
};

// EASTEREGG - the confirmation can't be turned back on
if (AerusW_mode === true) {
    toggleDeleteConfirm.checked = false;
    localStorage.setItem("confirmTaskDeletion", "false");
};

toggleDeleteConfirm.addEventListener("change", function(){
    if (AerusW_mode === true) {
        toggleDeleteConfirm.checked = false;
        alert("Le conferme non esistono più, ogni azione è definitiva.");
        return;
    };
    if (toggleDeleteConfirm.checked === true) {
        localStorage.setItem("confirmTaskDeletion", "true");
    } else {
        localStorage.setItem("confirmTaskDeletion", "false");
    };
});
