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
    if (confirm("Sei sicuro di voler eliminare l'intera lista? Questa azione è irreversibile.") === true) {
        taskStore.clear();
        window.location.href = "index.html";
    };
});

// Toggle for task deletion confirmation
let toggleDeleteConfirm = document.getElementById("toggleDeleteConfirm");
let tdcState = localStorage.getItem("confirmTaskDeletion");
if (tdcState === "true") {
   toggleDeleteConfirm.checked = true;
};

toggleDeleteConfirm.addEventListener("change", function(){
    if (toggleDeleteConfirm.checked === true) {
        localStorage.setItem("confirmTaskDeletion", "true");
    } else {
        localStorage.setItem("confirmTaskDeletion", "false");
    };
});
