let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");

let colors = ["pink", "blue", "green", "black"];

let uid = new ShortUniqueId();


if(localStorage.getItem("AllTickets") == undefined){
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("AllTickets" , allTickets);
}

loadTasks();


let allfilters = document.querySelectorAll(".filter div");
for(let i = 0 ; i < allfilters.length ; i++){
    let filter = allfilters[i];
    filter.addEventListener("click" , function(e){

        if(filter.classList[1] == "filter-selected"){
            filter.classList.remove("filter-selected");
            loadTasks();
            return;
        }

        for(let j = 0 ; j < allfilters.length ; j ++){
            allfilters[j].classList.remove("filter-selected");
        }

        filter.classList.add("filter-selected");
        let color = allfilters[i].classList[0];

        loadTasks(color);
    });
}

let deleteMode = false;
let deleteBtn = document.querySelector(".delete");
deleteBtn.addEventListener("click" , function (e) {
    if (addMode == true){
        return;
    }
    if(e.currentTarget.classList.contains("delete-selected")){
        e.currentTarget.classList.remove("delete-selected");
        deleteMode = false;
    }
    else{
        e.currentTarget.classList.add("delete-selected");
        deleteMode = true;
    }
});

let addMode = false;
addBtn.addEventListener("click" , function () {
    addMode = true;
    deleteBtn.classList.remove("delete-selected");
    deleteMode = false;
    let preModal = document.querySelector(".modal");

    if(preModal != null) return;

    let div = document.createElement("div");
    div.classList.add("modal");

    div.innerHTML = `<div class="task-section">
    <div class="task-inner-container" contenteditable="true"></div>
</div>
<div class="modal-priority-section">
    <div class="priority-inner-container">
        <div class="modal-priority pink"></div>
        <div class="modal-priority blue"></div>
        <div class="modal-priority green"></div>
        <div class="modal-priority black selected"></div>
    </div>
</div>`;

    let ticketColor = "black";

    let allModalPriority = div.querySelectorAll(".modal-priority");

    for(let i = 0 ; i < allModalPriority.length ; i ++){
        allModalPriority[i].addEventListener("click" , function(e) {
            for(let j = 0 ; j < allModalPriority.length ; j++){
                allModalPriority[j].classList.remove("selected");
            }

            e.currentTarget.classList.add("selected");
            ticketColor = e.currentTarget.classList[1];
        });
    }


    let taskInnerContainer = div.querySelector(".task-inner-container");

    taskInnerContainer.addEventListener("keydown" , function(e) {
        if(e.key == "Enter"){
            let id = uid();

            let task = e.currentTarget.innerText

            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
            let ticketObj = {
                color: ticketColor,
                taskValue: task,
            };

            allTickets[id] = ticketObj;

            localStorage.setItem("AllTickets" , JSON.stringify(allTickets));

            createTicketDiv(id , ticketColor , task);

            div.remove();
            addMode = false;
        }
        else if(e.key === "Escape"){
            div.remove();
            addMode = false;
        }
    });

    body.append(div);
});

function loadTasks(color){

    let allTicketsDiv = document.querySelectorAll(".ticket");

    for(let i = 0 ; i < allTicketsDiv.length ; i++){
        allTicketsDiv[i].remove();
    }

    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

    for(currID in allTickets){
        let singleTicketObj = allTickets[currID];

        if(color != undefined && singleTicketObj.color != color){
            continue;
        }
        createTicketDiv(currID , singleTicketObj.color , singleTicketObj.taskValue);

    }
}




function createTicketDiv(id , color , task){
    let ticketDiv = document.createElement("div");

    ticketDiv.classList.add("ticket");
    
    ticketDiv.innerHTML = ` <div data-id = "${id}" class="ticket-color ${color}"></div>
    <div class="ticket-id">
        #${id}
    </div>
    <div data-id = "${id}" class="actual-task"  contenteditable="true">
        ${task}
    </div>`;

    
    
    let ticketColorDiv = ticketDiv.querySelector(".ticket-color");
    
    ticketColorDiv.addEventListener("click" , function (e) {
        
        let currentColor = e.currentTarget.classList[1];
        
        let index = colors.indexOf(currentColor);
        
        index++;
        let newIndex = index % 4;
        
        let newColor = colors[newIndex];

        let id = ticketColorDiv.getAttribute("data-id");
        
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
        allTickets[id]["color"] = newColor;
        
        localStorage.setItem("AllTickets" , JSON.stringify(allTickets));
        
        
        e.currentTarget.classList.remove(currentColor);
        e.currentTarget.classList.add(newColor);
        
    });
    
    let actualTaskDiv = ticketDiv.querySelector(".actual-task");
    
    actualTaskDiv.addEventListener("input" , function(e) {
        let updatedTask = e.currentTarget.innerText;

        let id = e.currentTarget.getAttribute("data-id");
        let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

        allTickets[id].taskValue = updatedTask;

        localStorage.setItem("AllTickets", JSON.stringify(allTickets));
    });


    ticketDiv.addEventListener("click" , function(e){
        if (deleteMode) {
            let id = e.currentTarget.querySelector(".ticket-id").innerText.substring(1);
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
            delete allTickets[id];
            localStorage.setItem("AllTickets" , JSON.stringify(allTickets));
            e.currentTarget.remove();
        }
    });

    grid.append(ticketDiv);
}