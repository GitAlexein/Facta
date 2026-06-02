/* READING HIDDEN INPUT */
let inputTaskNew = document.getElementById("inputTaskNew");


/* TASK LIST */
let taskList = [];

/* READING LOCAL STORAGE */
if (localStorage.getItem("taskList") !== null) {
    taskList = JSON.parse(localStorage.getItem("taskList"))
    renderTaskList()
};


/* READING ADD-TASK BUTTON */
let buttonTaskNew = document.getElementById("buttonTaskNew");

/* CLICKING AND FOCUSING FUNCTION */
buttonTaskNew.addEventListener("click", function() {
    inputTaskNew.style.display= "block";
    inputTaskNew.focus();
});

/* SAVING INPUT IN LOCAL STORAGE FUNCTION*/
inputTaskNew.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault()
        if (inputTaskNew.value.trim() !== "") {
            taskList.push(inputTaskNew.value)
            localStorage.setItem("taskList", JSON.stringify(taskList))
            renderTaskList()
            inputTaskNew.value = ""
        } else {
            alert("Il testo è vuoto! Prova a scrivere qualcosa.")
        }
    }
});



/* TASK DELETION FUNCTION */
function deleteTask(index) {
    taskList.splice(index, 1)
    localStorage.setItem("taskList", JSON.stringify(taskList))
    renderTaskList()
};

/* RENDERING TASK-LIST FUNCTION */
function renderTaskList() {
    let taskListView = taskList.reverse().map(function(value, index) {
        return `
            <div class="task">
                <label id="labelCheckbox">
                    <input type="checkbox" class="task-checkbox">
                    <img src="assets/checkbox todo.svg" alt="" class="checkbox-icon todo">
                    <img src="assets/checkbox done.svg" alt="" class="checkbox-icon done">
                </label>
                <span class="task-text">${value}</span>
                <button class="button-tertiary" onclick="deleteTask(${index})">
                    <img src="assets/trash.svg" alt="Elimina questo obiettivo" style="height: 24px; cursor: pointer;">    
                </button>
</div>
        `
    });

    let taskView = document.getElementById("taskView");
    taskView.innerHTML = taskListView.join(" ");
};