let scheduleData = []; // Array to store schedule data (from schedule.csv)
let roomData = [];     // Array to store room data (from data.csv)

// Function to read and parse CSV files
function readCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const text = event.target.result;
        const lines = text.split('\n');
        const data = [];
        lines.forEach(line => {
            const cells = line.split(',');
            data.push(cells.map(cell => cell.trim()));
        });
        callback(data);
    };
    reader.readAsText(file);
}

// Function to process schedule data
function processScheduleData(data) {
    scheduleData = data.slice(1).map(row => {
        return {
            date: row[0],
            day: row[1],
            subject: row[2],
            time: row[3],
        };
    });
}

// Function to process room assignment data
function processRoomData(data) {
    roomData = data.slice(1).map(row => {
        return {
            rollRange: row[1],
            room: row[2],
        };
    });
}

// Function to find the room based on the roll number
function findRoom(rollNumber) {
    for (const entry of roomData) {
        const [startRoll, endRoll] = entry.rollRange.split('-').map(Number);
        if (rollNumber >= startRoll && rollNumber <= endRoll) {
            return entry.room;
        }
    }
    return "Room Not Found"; // Return a default if not found
}

// Function to generate the exam schedule based on the user's roll number
function generateSchedule() {
    const rollNo = parseInt(document.getElementById("rollNoInput").value);
    if (isNaN(rollNo)) {
        alert("Please enter a valid roll number.");
        return;
    }

    // Find the user's room
    const room = findRoom(rollNo);
    
    // Generate the schedule table
    const tableBody = document.getElementById("scheduleTable").getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ""; // Clear previous results

    scheduleData.forEach((entry, index) => {
        const row = tableBody.insertRow();

        // Insert the data into the row
        row.insertCell(0).innerText = index + 1;
        row.insertCell(1).innerText = entry.day;
        row.insertCell(2).innerText = entry.date;
        row.insertCell(3).innerText = entry.subject;
        row.insertCell(4).innerText = room;
        row.insertCell(5).innerText = entry.time;
    });
}

// Event listeners to handle file uploads
document.getElementById("scheduleFile").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        readCSV(file, processScheduleData);
    }
});

document.getElementById("roomFile").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        readCSV(file, processRoomData);
    }
});
