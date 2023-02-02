chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
      if (res.isRunning == true) {
        let timer = res.timer + 1;
        let isRunning = true;
        if (timer === res.timeOption * 60) {
          this.registration.showNotification("Pomodoro timer", {
            body: `${res.timeOption} minutes has passed`,
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

chrome.storage.local.get(["timer", "isRunning", "timeOption"], (res) => {
  chrome.storage.local.set({
    timer: "timer" in res ? res.timer : 0,
    isRunning: "isRunning" in res ? res.isRunning : false,
    timeOption: "timeOption" in res ? res.timeOption : 25,
  });
});
