// Desktop layout
function desktopLayout() {
    let width = window.innerWidth;
    let barTop = document.getElementById("barTop");
    let barBottom = document.getElementById("barBottom");
    let welcomeIllustration = document.getElementById("welcomeIllustration");
    let body = document.getElementById("welcomePage");
    // The bar is only moved when it is in the wrong place: re-appending it detaches
    // the node and blurs the input inside, which closes the keyboard on mobile
    if (width >= 1000) {
        if (barBottom.parentElement !== barTop) {
            barTop.appendChild(barBottom);
        };
        if (width < 1230) {
            welcomeIllustration.style.padding = "64px";
        } else {
            welcomeIllustration.style.padding = "0";
        }
        if (width < 1175) {
            barTop.style.padding = "32px";
        } else {
            barTop.style.padding = "";
        }
    } else {
        if (barBottom.parentElement !== body) {
            body.appendChild(barBottom);
        };
        welcomeIllustration.style.padding = "0";
        barTop.style.padding = "";
    }
}

// Corrects layout for the first time
desktopLayout();

// Corrects layout every time a resize happens
window.addEventListener("resize", function() {
    desktopLayout();
})

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