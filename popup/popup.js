let tasks = [];

function updateTime() {
  chrome.storage.local.get(["timer"], (res) => {
    const time = document.getElementById("time");
    const minutes = `${25 - Math.ceil(res.timer / 60)}`.padStart(2, "0");
    const seconds = `${
      60 - (res.timer % 60) === 60 ? "00" : 60 - (res.timer % 60)
    }`.padStart(2, "0");

    time.textContent = `${minutes}:${seconds}`;
  });
}

updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById("start-time-btn");
startTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startTimerBtn.textContent = !res.isRunning
          ? "Pause timer"
          : "Start timer";
      }
    );
  });
});

const resetTimerBtn = document.getElementById("reset-time-btn");
resetTimerBtn.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning", "timer"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: false,
        timer: 0,
      },
      () => {
        startTimerBtn.textContent = "Start timer";
      }
    );
  });
});

const addTaskBtn = document.getElementById("add-task-btn");
addTaskBtn.addEventListener("click", () => addTask());

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks: tasks,
  });
}

function renderTask(tasksNum) {
  const taskRow = document.createElement("div");

  const text = document.createElement("input");
  text.type = "text";
  text.placeholder = "Enter a task";
  text.value = tasks[tasksNum];
  text.addEventListener("change", () => {
    tasks[tasksNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement("input");
  deleteBtn.type = "button";
  deleteBtn.value = "X";
  deleteBtn.addEventListener("click", () => {
    deleteTask(tasksNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

function addTask() {
  tasksNum = tasks.length;
  tasks.push("");
  renderTask(tasksNum);
  saveTasks();
}

function deleteTask(tasksNum) {
  tasks.splice(tasksNum, 1);
  renderTasks();
  saveTasks();
}

function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.textContent = "";
  tasks.forEach((tastText, tasksNum) => {
    renderTask(tasksNum);
  });
}
