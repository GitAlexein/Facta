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
        taskList.push(inputTaskNew.value)
        localStorage.setItem("taskList", JSON.stringify(taskList))
        renderTaskList()
        inputTaskNew.value = ""
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
            <p>${value}</p>
            <span style="cursor: pointer;" onclick="deleteTask(${index})"><img src="assets/trash.svg"></img></span>
            </div>
        `
    });

    let taskView = document.getElementById("taskView");
taskView.innerHTML = taskListView.join(" ");
};