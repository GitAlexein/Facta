// CSS effects fix for Apple devices >:(
document.body.addEventListener("touchstart", function() {});

// CHECKS IF FIRST LOGIN
if (!localStorage.getItem("hasVisited")) {;
  localStorage.setItem("hasVisited", "true");
  window.location.replace("welcome.html");
}

// Reads greeting and name
let greeting = document.getElementById("greeting");
let name = document.getElementById("name");

// Displays name
let nameSaved = localStorage.getItem("name");
if (nameSaved=== null) {
    name.innerText = "utente";
} else {
    name.innerText = nameSaved.trim();
};

// Displays greeting
let date = new Date();
let hour = date.getHours();

if (hour < 6) {
    greeting.innerText = "Ciao";
} else if (hour >= 6 && hour < 12) {
    greeting.innerText = "Buongiorno";
} else if (hour >= 12 && hour < 18) {
    greeting.innerText = "Buon pomeriggio";
} else if (hour > 18) {
    greeting.innerText = "Buonasera";
}

// Displays tasks
renderTaskList()

// Reads buttons and input
let buttonTaskNew = document.getElementById("buttonTaskNew");
let inputTaskNew = document.getElementById("inputTaskNew");
let buttonSettings = document.getElementById("buttonSettings");


// Click and focus function
buttonTaskNew.addEventListener("click", function() {;
    buttonTaskNew.style.display= "none";
    buttonSettings.style.display= "none";
    inputTaskNew.style.display= "block";
    inputTaskNew.focus();
});

// Saves input in localStorage
inputTaskNew.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        if (inputTaskNew.value.trim() !== "") {
            taskStore.add(inputTaskNew.value);
            renderTaskList();
            buttonTaskNew.style.display= "";
            buttonSettings.style.display= "";
            inputTaskNew.style.display= "";
            inputTaskNew.value = ""
        } else {
            alert("Il testo è vuoto! Prova a scrivere qualcosa.");
        };
    };
});

// Checkbox toggle function
function toggleTask(id) {
    taskStore.toggle(id);
    renderTaskList();
};

// Updates task
function updateTask(id) {
    let input = document.getElementById(`input-${id}`);
    let text = document.getElementById(`text-${id}`);
    text.style.display = "none";
    input.value = text.innerText;
    input.style.display = "block";
    input.focus();

    input.addEventListener("keydown", function(e){
        if (e.key === "Enter") {
            if (input.value.trim() !== "") {
                taskStore.update(id, input.value.trim());
                input.style.display = "";
                text.style.display = "block";
                renderTaskList();
            } else {
                alert("Il testo è vuoto! Se vuoi eliminare questa task clicca sul cestino.");
            };
            
            
        };
    });
};

// Removes task
function deleteTask(id) {
    if (confirm("Sei sicuro di voler eliminare questa task?") === true) {
        taskStore.remove(id);
        renderTaskList();
    };
};

// Renders task list
function renderTaskList() {
    let tasks = taskStore.getAll();
    let taskListView = tasks.map(function(task) {
        return `
            <div class="task">
                <label class="label-checkbox">
                    <input type="checkbox" class="task-checkbox" ${task.done === true ? "checked" : ""} onchange="toggleTask(${task.id})">
                    <img src="assets/checkbox todo.svg" alt="" class="checkbox-icon todo">
                    <img src="assets/checkbox done.svg" alt="" class="checkbox-icon done">
                </label>
                <span class="task-text" style="overflow-wrap: break-word;" id="text-${task.id}" onclick="updateTask(${task.id})">${task.text}</span>
                <input type="text" style="display: none;" id="input-${task.id}">
                <button class="button button-tertiary" onclick="deleteTask(${task.id})">
                    <img src="assets/trash.svg" alt="Elimina questo obiettivo" style="height: 24px; cursor: pointer;">    
                </button>
            </div>
                `;
    });

    let taskView = document.getElementById("taskView");
    taskView.innerHTML = taskListView.join(" ");
};