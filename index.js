/* TOUCH FIX FOR APPLE DEVICES >:( */
document.body.addEventListener("touchstart", function() {});

// READING GREETING & NAME
let greeting = document.getElementById("greeting");
let name = document.getElementById("name");

// DISPLAYING NAME
name.innerText = localStorage.getItem("name");

/* READING BUTTONs AND INPUT*/
let buttonTaskNew = document.getElementById("buttonTaskNew");
let inputTaskNew = document.getElementById("inputTaskNew");
let buttonSettings = document.getElementById("buttonSettings");


/* TASK LIST */
let taskList = [];

/* READING LOCAL STORAGE */
if (localStorage.getItem("taskList") !== null) {
    taskList = JSON.parse(localStorage.getItem("taskList"))
    renderTaskList()
};


/* CLICKING AND FOCUSING FUNCTION */
buttonTaskNew.addEventListener("click", function() {
    buttonTaskNew.style.display= "none";
    buttonSettings.style.display= "none";
    inputTaskNew.style.display= "block";
    inputTaskNew.focus();
});

/* SAVING INPUT IN LOCAL STORAGE FUNCTION*/
inputTaskNew.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault()
        if (inputTaskNew.value.trim() !== "") {
            taskList.unshift(inputTaskNew.value)
            localStorage.setItem("taskList", JSON.stringify(taskList))
            renderTaskList()
            buttonTaskNew.style.display= "";
            buttonSettings.style.display= "";
            inputTaskNew.style.display= "";
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
    let taskListView = taskList.map(function(value, index) {
        return `
            <div class="task">
                <label id="labelCheckbox">
                    <input type="checkbox" class="task-checkbox">
                    <img src="assets/checkbox todo.svg" alt="" class="checkbox-icon todo">
                    <img src="assets/checkbox done.svg" alt="" class="checkbox-icon done">
                </label>
                <span class="task-text">${value}</span>
                <button class="button button-tertiary" onclick="deleteTask(${index})">
                    <img src="assets/trash.svg" alt="Elimina questo obiettivo" style="height: 24px; cursor: pointer;">    
                </button>
</div>
        `
    });

    let taskView = document.getElementById("taskView");
    taskView.innerHTML = taskListView.join(" ");
};