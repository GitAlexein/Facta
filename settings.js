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
    let newName = prompt("Inserisci il nuovo nome da utilizzare.")
    if (newName.trim() !== "") {
        localStorage.setItem("name", newName.trim())
        window.location.href = "index.html";
    }
});


// Clear list button
buttonListClear.addEventListener("click", function(){
    if (confirm("Sei sicuro di voler eliminare l'intera lista? Questa azione è irreversibile.") === true) {
        taskStore.clear();
        window.location.href = "index.html";
    }
});