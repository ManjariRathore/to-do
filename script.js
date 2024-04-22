let days; 
let firstDay;
const tasksFromLocalStorage = localStorage.getItem("tasks");
let tasks = [];
if (!tasksFromLocalStorage) {
    localStorage.setItem("tasks", []);

} else {
    tasks = JSON.parse(tasksFromLocalStorage);
}


document.addEventListener("DOMContentLoaded", function () {
    let monthElement = document.getElementById("month");
    days = document.getElementById("days"); 

    function createCalendar(year, month) {
        let date = new Date();
        let y = date.getYear() ;
        let m = date.getMonth() ;
        let daysInMonth = getDaysInMonth( y , m )
        firstDay = new Date(y, m, 1).getDay();
        monthElement.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
        days.innerHTML = "";

        for (let i = 1-firstDay-2; i <= daysInMonth; i++) {
            if (i >= 1) {
                let day = document.createElement("div");
                day.textContent = i;
                days.appendChild(day);
            } else {
                days.appendChild(document.createElement("div"))
            }
        }


    }
    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
    let currentdate = new Date();
    let currentYear = currentdate.getFullYear();
    let currentMonth = currentdate.getMonth();
    createCalendar(currentYear, currentMonth);
    tasks.forEach((taskItem) => {

        const taskText = taskItem.text;
        let taskDeadlineValue = taskItem.deadline;
        let taskDeadline;
        if (!taskDeadlineValue) {
            taskDeadline = new Date();
        } else {
            taskDeadline = new Date(taskDeadlineValue);
        }
        if (taskText.trim() !== "") {
            var completeButton = document.createElement("button");
            completeButton.classList.add("circular-btn");
            var list =  document.getElementById("task");
            var task =  document.createElement("li");
            if (taskItem.completed) {
                task.classList.toggle("completed");
            }
            list.appendChild(task);
            task.appendChild(completeButton);
            task.setAttribute("data-taskId", taskItem.id)
            task.appendChild(document.createTextNode(taskText + " Deadline: " + taskDeadline.getDate() + " " + taskDeadline.getDay()));
            completeButton.onclick = markAsComplete;
    
            let dayOfMonth = taskDeadline.getDate();
            let dayElement = days.querySelector(`.days div:nth-child(${dayOfMonth+firstDay+2})`);
    
            if (dayElement) {
                let taskOnCalendar = document.createElement("div");
                taskOnCalendar.classList.add("task-cal");
                if (taskItem.completed) {
                    taskOnCalendar.classList.toggle("completed");
                }
                taskOnCalendar.setAttribute("data-taskId-on-cal", taskItem.id);
                taskOnCalendar.textContent = taskText;
                dayElement.appendChild(taskOnCalendar);
            } else {
                alert("Please enter a valid task and deadline.");
            }
        }
    })
});
function saveTasksToLocalStorage () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function addTask() {

    const taskText = document.getElementById("TaskInput").value;
    let taskDeadlineValue = document.getElementById("DeadlineInput").value;
    let taskDeadline;
    if (!taskDeadlineValue) {
        taskDeadline = new Date();
    } else {
        taskDeadline = new Date(taskDeadlineValue);
    }
    const id = generateId(8);
    tasks.push({id, text: taskText, deadline: taskDeadline, completed: false});
    saveTasksToLocalStorage();
    // console.log({tasks})
    if (taskText.trim() !== "") {
        var completeButton = document.createElement("button");
        completeButton.classList.add("circular-btn");
        var list =  document.getElementById("task");
        var task =  document.createElement("li");
        task.setAttribute("data-taskId", id);
        list.appendChild(task);
        task.appendChild(completeButton);
        task.appendChild(document.createTextNode( taskText + " Deadline: " + taskDeadline.getDate()+" , "+ taskDeadline.toLocaleString('default', { month: 'long' })));


        completeButton.onclick = markAsComplete;

        let dayOfMonth = taskDeadline.getDate();
        let dayElement = days.querySelector(`.days div:nth-child(${dayOfMonth+firstDay+2})`);

        if (dayElement) {
            let taskOnCalendar = document.createElement("div");
            taskOnCalendar.setAttribute("data-taskId-on-cal", id);
            taskOnCalendar.classList.add("task-cal");
            taskOnCalendar.textContent = taskText;
            dayElement.appendChild(taskOnCalendar);
        } else {
            alert("Please enter a valid task and deadline.");
        }
    }
}
function markAsComplete() {
    var listItem = this.parentNode;
    console.log({this: this.parentNode})
    const taskId = this.parentNode.getAttribute("data-taskId");
    console.log({taskId})
    tasks.forEach((task) => {
        if (task.id == taskId) {
            task.completed = !task.completed;
        }
    })
    saveTasksToLocalStorage();
    document.querySelector(`[data-taskId-on-cal="${taskId}"]`).classList.toggle("completed");
    listItem.classList.toggle("completed");
}

function dec2hex (dec) {
    return dec.toString(16).padStart(2, "0")
  }
  
  // generateId :: Integer -> String
function generateId (len) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}
  