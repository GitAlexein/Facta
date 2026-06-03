// READING INPUT, BUTTON AND HIDDEN SKIP BUTTON
let inputNameNew = document.getElementById("inputNameNew");
let buttonNameNew = document.getElementById("buttonNameNew");
let buttonSkipName = document.getElementById("buttonSkipName")

// BUTTON CLICKING FUNCTION
buttonNameNew.addEventListener("click", function() {
    if (inputNameNew.value.trim() !== "") {
        localStorage.setItem("name", inputNameNew.value)
        window.location.href = "index.html"
    } else {
        alert("Non hai inserito nessun nome. Per continuare inseriscine uno o salta questo passaggio.")
        buttonSkipName.style.display = ""
    }
});

// SKIP BUTTON FUNCTION
buttonSkipName.addEventListener("click", function(){
    window.location.href = "index.html"
});