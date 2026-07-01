// CSS effects fix for Apple devices >:(
document.body.addEventListener("touchstart", function() {});

// Checks if user is already logged
if (!localStorage.getItem("hasVisited")) {
  localStorage.setItem("hasVisited", "true");
  localStorage.setItem("confirmTaskDeletion", "true")
  window.location.replace("welcome.html");
};

// Reads greeting and name
let greeting = document.getElementById("greeting");
let name = document.getElementById("name");

// Displays name
let nameSaved = localStorage.getItem("name");
if (nameSaved !== null && nameSaved !== "") {
    let nameEdited = ` ${nameSaved.trim()}`;
    name.innerText = nameEdited;
};

// Displays greeting
let date = new Date();
let hour = date.getHours();

if (hour < 6) {
    greeting.innerText = "Ciao";
} else if (hour < 12) {
    greeting.innerText = "Buongiorno";
} else if (hour < 18) {
    greeting.innerText = "Buon pomeriggio";
} else {
    greeting.innerText = "Buonasera";
};

// Reads the empty list view (div)
let emptyListView = document.getElementById("emptyListView");

// Displays tasks
renderTaskList()

// Reads buttons and input
let buttonTaskNew = document.getElementById("buttonTaskNew");
let inputTaskNew = document.getElementById("inputTaskNew");
let buttonSettings = document.getElementById("buttonSettings");
let buttonTaskCancel = document.getElementById("buttonTaskCancel");


// Settings button click
buttonSettings.addEventListener("click", function(){
    window.location.href = "settings.html";
});

// Restores inputTaskNew to default
function inputTaskNewDefault() {
    inputTaskNew.value = "";
    inputTaskNew.style.borderColor = "var(--accent)";
    errorTaskEmpty.style.display = "none";
}

// Task button click and focus
let inputTaskNewDiv = document.getElementById("inputTaskNewDiv")


function itnShow() { // itn = inputTaskNew
    buttonTaskNew.style.display = "none";
    buttonSettings.style.display = "none";
    buttonTaskCancel.style.display = "";
    inputTaskNewDiv.style.display = "flex";
    inputTaskNew.focus();
    document.addEventListener("keydown", cancelShortcut);
};

buttonTaskNew.addEventListener("click", function() {;
    itnShow();
});

document.addEventListener("keydown", function(e){
    let modifier = e.ctrlKey || e.metaKey;
    if (modifier && e.key === "n") {
        e.preventDefault();
        itnShow();
    }
});

// Cancels the creation of a new task
function itnCancel() { // itn = inputTaskNew
    buttonTaskCancel.style.display = "none";
    inputTaskNewDiv.style.display = "none";
    inputTaskNewDefault();
    buttonTaskNew.style.display = "";
    buttonSettings.style.display = "";
};

function cancelShortcut(e) {
    if (e.key === "Escape") {
        e.preventDefault();
        itnCancel();
        document.removeEventListener("keydown", cancelShortcut);
    };
};

buttonTaskCancel.addEventListener("click", function(){
    itnCancel();
});

// FUNCTION - Saves task and changes appearances
function finalizeTask() {
    taskStore.add(inputTaskNew.value);
    renderTaskList();
    buttonTaskNew.style.display= "";
    buttonSettings.style.display= "";
    buttonTaskCancel.style.display = "none";
    inputTaskNewDiv.style.display= "none";
    inputTaskNewDefault();
};

// Reads the hidden error message
let errorTaskEmpty = document.getElementById("errorTaskEmpty");

// Saves input in localStorage
inputTaskNew.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        if (inputTaskNew.value.trim() === "qualcosa" || inputTaskNew.value.trim() === "Qualcosa" || inputTaskNew.value.trim() === "qualcosa." || inputTaskNew.value.trim() === "Qualcosa.") {
            finalizeTask();
            alert("sei troppo divertente, ora siamo amici");
        } else if (inputTaskNew.value.trim() !== "") {
            finalizeTask();
        } else {
            inputTaskNew.style.borderColor = "var(--danger-accent)";
            errorTaskEmpty.style.display = "";        // Shows error message
        };
    };
});

// FUNCTION - Checkbox toggle
function toggleTask(id) {
    taskStore.toggle(id);
    renderTaskList();
};

// FUNCTION - Updates task
function updateInputShow(id) {
    let input = document.getElementById(`input-${id}`);
    let text = document.getElementById(`text-${id}`);
    text.style.display = "none";
    input.value = text.innerText;
    input.style.display = "block";
    input.focus();
};

function updateInputSave(id, e) {
    let input = document.getElementById(`input-${id}`);
    let text = document.getElementById(`text-${id}`)
    if (e.key === "Enter") {
        if (input.value.trim() !== "") {
            taskStore.update(id, input.value.trim());
            input.style.display = "";
            text.style.display = "block";
            renderTaskList();
        } else {
            alert("Non si possono salvare task vuote! Se vuoi eliminare questa task clicca sul cestino.");
        };
    };
};

// FUNCTION - Removes task
function deleteTask(id) {
    if (localStorage.getItem("confirmTaskDeletion") === "true") {
        if (confirm("Sei sicuro di voler eliminare questa task? Puoi sempre eliminare l'intera lista dalle impostazioni.") === true) {
            taskStore.remove(id);
            renderTaskList();
    };
    } else {
        taskStore.remove(id);
        renderTaskList();
    };
};

// FUNCTION - Renders task list
function renderTaskList() {
let tasks = taskStore.getAll()
let taskView = document.getElementById("taskView");
if (tasks.length === 0) {
    taskView.style.display = "none";
    emptyListView.style.display = "flex";
} else {
    taskView.style.display = "";
    emptyListView.style.display = "none";
    let taskListView = tasks.map(function(task) {
        return `
            <div class="task">
                <label class="label-checkbox">
                    <input type="checkbox" class="task-checkbox" ${task.done === true ? "checked" : ""} onchange="toggleTask(${task.id})">
                    <img src="assets/checkbox todo.svg" alt="" class="checkbox-icon todo">
                    <img src="assets/checkbox done.svg" alt="" class="checkbox-icon done">
                </label>
                <span class="task-text" style="overflow-wrap: break-word;" id="text-${task.id}" onclick="updateInputShow(${task.id})">${task.text}</span>
                <input type="text" style="display: none;" id="input-${task.id}" onkeydown="updateInputSave(${task.id}, event)">
                <button class="button button-tertiary-icon" onclick="deleteTask(${task.id})">
                    <img src="assets/trash tertiary.svg" alt="Elimina questo obiettivo" style="height: 24px; cursor: pointer;">    
                </button>
            </div>
                `;
    });
    taskView.innerHTML = taskListView.join(" ");
    };
    };
