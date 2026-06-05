// Reads buttons and inputs
let inputNameNew = document.getElementById("inputNameNew");
let buttonNameNew = document.getElementById("buttonNameNew");
let buttonSkipName = document.getElementById("buttonSkipName")

// Input & button event listeners
buttonNameNew.addEventListener("click", function(){
    saveName();
});

inputNameNew.addEventListener("keydown", function(e){
    if (e.key === "Enter") {
        saveName()
    }
});

// Saves name
function saveName() {
    if (inputNameNew.value.trim() !== "") {
        localStorage.setItem("name", inputNameNew.value)
        window.location.href = "index.html"
    } else {
        alert("Non hai inserito nessun nome. Per continuare inseriscine uno o salta questo passaggio.")
        buttonSkipName.style.display = ""
    }
}

// Skip button function
buttonSkipName.addEventListener("click", function(){
    window.location.href = "index.html"
});