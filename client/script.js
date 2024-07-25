document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = document.querySelector('.input');
    const display = document.querySelector('.display');

    async function loadTasks() {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/todos');
            if (!response.ok) throw new Error('Network response was not ok.');
            const tasks = await response.json();
            displayTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    function displayTasks(tasks) {
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.dataset.id = task.id; 
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `checkbox-${task.id}`; // Unique ID for each checkbox
            taskElement.appendChild(checkbox);
            
            const taskSpan = document.createElement('span');
            taskSpan.textContent = task.todos; // Assuming your API returns tasks with a "todos" property
            taskSpan.className = "task-text";
            taskElement.appendChild(taskSpan);

            display.appendChild(taskElement);

            // Add event listener for task element
            checkbox.addEventListener('click', () => {
                setTimeout(() => {
                    deleteTask(task);
                }, 1000); // 2-second delay
            });
        });
    }

    // Fetch tasks when the page loads
    loadTasks();

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const taskData = input.value.trim(); 
        if (!taskData) return; 

        try {
            const response = await fetch('http://127.0.0.1:5000/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: taskData })
            });
            const result = await response.json();
            console.log('Created task:', result); // Debug log

            if (!result.id) {
                console.error('No ID returned from server');
                return;
            }

            // Add the new task to the display
            const taskElement = document.createElement('div');
            taskElement.classList.add('task');
            taskElement.dataset.id = result.id; // Use the ID returned from the server
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `checkbox-${result.id}`; // Unique ID for the checkbox
            taskElement.appendChild(checkbox);
            
            const taskSpan = document.createElement('span');
            taskSpan.textContent = taskData;
            taskSpan.className = "task-text";
            taskElement.appendChild(taskSpan);

            display.appendChild(taskElement);

            input.value = '';

            // Add event listener for the new task element
            taskElement.addEventListener('click', () => {
                setTimeout(() => {
                    deleteTask(taskElement);
                }, 2000); // 2-second delay
            });
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function deleteTask(taskElement) {
    const task = taskElement.todos; 
    console.log(task)
    if (!task) {
        console.error('No task ID available for deletion');
        return;
    }

    fetch("http://127.0.0.1:5000/api/todos", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: task })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Delete response:', data);
        if (data.message === "data deleted successfully") {
            taskElement.remove();
        } else {
            console.error('Failed to delete the task');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
