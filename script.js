document.addEventListener('DOMContentLoaded', function() {
    const scheduleFileInput = document.getElementById('scheduleFile');
    const roomFileInput = document.getElementById('roomFile');
    const findScheduleBtn = document.getElementById('findScheduleBtn');
    const scheduleTable = document.getElementById('scheduleTable');
    const scheduleBody = document.getElementById('scheduleBody');
    
    let scheduleData = [];
    let roomData = [];

    // Function to read CSV files and parse data
    function readCSV(file, callback) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const text = event.target.result;
            const rows = text.split('\n').map(row => row.split(','));
            callback(rows);
        };
        reader.readAsText(file);
    }

    // Parse schedule data
    function processScheduleData(rows) {
        scheduleData = rows.slice(1).map(row => ({
            date: row[0],
            day: row[1],
            subject: row[2],
            time: row[3]
        }));
    }

    // Parse room data
    function processRoomData(rows) {
        roomData = rows.slice(1).map(row => ({
            rollNoRange: row[1],
            room: row[2]
        }));
    }

    // Function to find schedule for a given roll number
    function findSchedule(rollNo) {
        const results = [];
        
        // Loop through the schedule data to match roll numbers
        scheduleData.forEach((schedule, index) => {
            const [startRoll, endRoll] = schedule.subject.split("-").map(num => parseInt(num.trim(), 10));
            if (rollNo >= startRoll && rollNo <= endRoll) {
                const room = getRoomForRollNo(rollNo);
                results.push({
                    number: index + 1,
                    day: schedule.day,
                    date: schedule.date,
                    subject: schedule.subject,
                    room: room,
                    time: schedule.time
                });
            }
        });

        return results;
    }

    // Function to get room based on roll number
    function getRoomForRollNo(rollNo) {
        for (const room of roomData) {
            const [startRoll, endRoll] = room.rollNoRange.split("-").map(num => parseInt(num.trim(), 10));
            if (rollNo >= startRoll && rollNo <= endRoll) {
                return room.room;
            }
        }
        return "Not Found";
    }

    // Handle "Find Schedule" button click
    findScheduleBtn.addEventListener('click', function() {
        const rollNo = parseInt(prompt("Enter your roll number:"), 10);
        if (isNaN(rollNo)) {
            alert("Please enter a valid roll number");
            return;
        }

        // Filter schedule based on roll number
        const results = findSchedule(rollNo);

        // Display results in the table
        if (results.length > 0) {
            scheduleTable.style.display = "table";
            scheduleBody.innerHTML = ""; // Clear existing rows

            results.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${result.number}</td>
                    <td>${result.day}</td>
                    <td>${result.date}</td>
                    <td>${result.subject}</td>
                    <td>${result.room}</td>
                    <td>${result.time}</td>
                `;
                scheduleBody.appendChild(row);
            });
        } else {
            alert("No exams found for your roll number.");
        }
    });

    // Listen for file uploads
    scheduleFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            readCSV(file, processScheduleData);
        }
    });

    roomFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            readCSV(file, processRoomData);
        }
    });
});
