// Reads buttons
let buttonBack = document.getElementById("buttonBack");
let buttonNameChange = document.getElementById("buttonNameChange");
let buttonListClear = document.getElementById("buttonListClear");

let buttonExport = document.getElementById("buttonExport");
let buttonImport = document.getElementById("buttonImport");
let inputImport = document.getElementById("inputImport");

// Normalizes any imported data to the current task shape (handles old formats)
function migrateTasks(data) {
    let tasks = Array.isArray(data) ? data : data.tasks;
    if (!Array.isArray(tasks)) return null;

    return tasks
        .filter(t => t && typeof t.text === "string")
        .map(t => ({
            id: typeof t.id === "number" ? t.id : Date.now() + Math.floor(Math.random() * 1000),
            text: t.text,
            done: t.done === true,
            createdAt: typeof t.createdAt === "string" ? t.createdAt : new Date().toISOString()
        }));
}

// Exports the current list as a downloadable JSON file
function exportTasks() {
    let data = {
        app: "Praxisum Facta",
        exportedAt: new Date().toISOString(),
        name: localStorage.getItem("name") || null,
        tasks: taskStore.getAll()
    };

    let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    let stamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    a.href = url;
    a.download = `praxisum-facta-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Reads a JSON file and replaces the current list
function importTasks(file) {
    let reader = new FileReader();
    reader.onload = function() {
        let data;
        try {
            data = JSON.parse(reader.result);
        } catch (err) {
            alert("File non valido: non è un JSON leggibile.");
            return;
        }

        let tasks = migrateTasks(data);
        if (tasks === null) {
            alert("Questo file non contiene una lista di task valida.");
            return;
        }

        if (!confirm("Importare sostituirà la tua lista attuale. Continuare?")) {
            return;
        }

        taskStore.replaceAll(tasks);
        if (data.name) localStorage.setItem("name", data.name);
        alert(`Importate ${tasks.length} task con successo!`);
        window.location.href = "index.html"; // home re-renders the list on load
    };
    reader.readAsText(file);
}

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

// Export button
buttonExport.addEventListener("click", exportTasks);

// Import button
buttonImport.addEventListener("click", function(){
    inputImport.click();
});

inputImport.addEventListener("change", function(e){
    if (e.target.files.length > 0) {
        importTasks(e.target.files[0]);
        e.target.value = ""; // reset so re-importing the same file still fires
    }
});