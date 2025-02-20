// Get DOM elements
const taskInput = document.getElementById('task-input');
const timeInput = document.getElementById('time-input');
const addBtn = document.getElementById('add-btn');
const tasksList = document.getElementById('tasks-list');
const filterTasks = document.getElementById('filter-tasks');
const currentDateElement = document.getElementById('current-date');

// Initialize tasks array from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Set current date
function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add new task
function addTask(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    const taskTime = timeInput.value;
    
    if (!taskText || !taskTime) {
        alert('Please fill in both task and time!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskText,
        time: taskTime,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    renderTasks();
    
    taskInput.value = '';
    timeInput.value = '';
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Render tasks
function renderTasks() {
    const filterValue = filterTasks.value;
    
    let filteredTasks = tasks;
    if (filterValue === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filterValue === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    // Sort tasks by time
    filteredTasks.sort((a, b) => {
        return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
    });
    
    tasksList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-info">
                <span class="task-time">${task.time}</span>
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask(${task.id})">
                    <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
    `).join('');
}

// Event listeners
addBtn.addEventListener('click', addTask);
filterTasks.addEventListener('change', renderTasks);

// Initialize app
setCurrentDate();
renderTasks();

// Update current date every minute
setInterval(setCurrentDate, 60000);