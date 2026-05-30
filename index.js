/* READING HIDDEN INPUT */
let inputTaskNew = document.getElementById("inputTaskNew");


/* TASK LIST */
let taskList = [];

/* READING LOCAL STORAGE */
if (localStorage.getItem("taskList") !== null) {
    taskList = JSON.parse(localStorage.getItem("taskList"))
};


/* READING ADD-TASK BUTTON */
let buttonTaskNew = document.getElementById("buttonTaskNew");

/* CLICKING & FOCUSING ON INPUT */
buttonTaskNew.addEventListener("click", function() {
    inputTaskNew.style.display= "block";
    inputTaskNew.focus();
});

/* SAVING INPUT IN LOCAL STORAGE */
inputTaskNew.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        taskList.push(inputTaskNew.value)
        localStorage.setItem("taskList", JSON.stringify(taskList))
    }
});


/* SETTING THE VIEW FOR TASK-LIST */
let taskListView = taskList.map(function(value) {
    return `<li>${value}</li>`
});

/* DISPLAYING TASK-LIST */
let taskView = document.getElementById("taskView");
taskView.innerHTML = taskListView.join(" ");

/* BISOGNA CREARE UNA FUNZIONE RIUTILIZZABILE PER MOSTRARE LE TASK AGGIUNTE SUBITO ANZICHE' DOPO AVER RICARICATO LA PAGINA */