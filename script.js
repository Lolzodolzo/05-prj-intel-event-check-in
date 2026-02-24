const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const greeting = document.getElementById("greeting")
const attendCount = document.getElementById("attendeeCount");
const progBar = document.getElementById("progressBar");
const teamSelect = document.getElementById("teamSelect");
const storageKey = "intelCheckInData";
const maxAttendeeCount = 50;

// Load saved data when page opens
loadSavedData();
updateProgressBar();

form.addEventListener("submit", function (e) {
    e.preventDefault();
    addAttendee();
});

function addAttendee() {
    greeting.style.display = "inline";
    const name = nameInput.value.trim();
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;
    
    if (attendCount.innerHTML == maxAttendeeCount) {
        greeting.innerHTML = `Sorry ${name}, but attendence is full.`;        
        return;
    }

    incrementAttendance(team);
    updateList(team, name);

    greeting.textContent = `Hello, ${name}, and welcome to ${teamName}!`;

    if (Number(attendCount.textContent) >= maxAttendeeCount) {
        celebrate(teamName);
    }

    saveData();
    form.reset();
}

function incrementAttendance(team) {
    const teamCount = document.getElementById(`${team}Count`);
    attendCount.innerHTML++;    
    teamCount.innerHTML++;
    updateProgressBar();
}

function updateList(team, name) {
    const nameList = document.getElementById(`${team}List`);
    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}</strong>`;
    nameList.appendChild(li);
}

function updateProgressBar() {
    const percent = Math.min(attendCount.innerHTML / maxAttendeeCount, 1) * 100;
    progBar.style.width = `${percent}%`;
}

function saveData() {
    const data = {
        attendeeCount: Number(attendCount.textContent),
        waterCount: Number(document.getElementById("waterCount").textContent),
        zeroCount: Number(document.getElementById("zeroCount").textContent),
        powerCount: Number(document.getElementById("powerCount").textContent),
        waterNames: getNamesFromList("waterList"),
        zeroNames: getNamesFromList("zeroList"),
        powerNames: getNamesFromList("powerList")
    };

    localStorage.setItem(storageKey, JSON.stringify(data));
}

function loadSavedData() {
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
        return;
    }

    const data = JSON.parse(saved);

    attendCount.textContent = data.attendeeCount || 0;
    document.getElementById("waterCount").textContent = data.waterCount || 0;
    document.getElementById("zeroCount").textContent = data.zeroCount || 0;
    document.getElementById("powerCount").textContent = data.powerCount || 0;

    fillList("waterList", data.waterNames || []);
    fillList("zeroList", data.zeroNames || []);
    fillList("powerList", data.powerNames || []);

    updateProgressBar();    
}

function getNamesFromList(listId) {
    const list = document.getElementById(listId);
    const items = list.querySelectorAll("li");
    const names = [];

    let i = 0;
    while (i < items.length) {
        names.push(items[i].textContent.trim());
        i = i + 1;
    }

    return names;
}

function fillList(listId, names) {
    const list = document.getElementById(listId);
    list.innerHTML = "";

    let i = 0;
    while (i < names.length) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${names[i]}</strong>`;
        list.appendChild(li);
        i = i + 1;
    }
}

function celebrate(team) {
    const message = document.getElementById("celebrationMessage");
    message.innerHTML = `🎉Congratulations to ${team} for winning!🎉`;
}