chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(["timer", "isRunning"], (res) => {
      if (res.isRunning == true) {
        let timer = res.timer + 1;
        let isRunning = true;
        if (timer === 10) {
          this.registration.showNotification("Pomodoro timer", {
            body: "25 minutes has passed",
            icon: "icon.png",
          });
          timer = 0;
          isRunning = false;
        }
        chrome.storage.local.set({
          timer: timer,
          isRunning: isRunning,
        });
      } else {
        res.timer = 0;
      }
    });
  }
});

chrome.storage.local.get(["timer", "isRunning"], (res) => {
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    isRunning: "isRunning" in res ? res.isRunning : false,
  });
});
