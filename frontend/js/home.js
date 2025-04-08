document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "http://localhost:8000/api";
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const loadingoverlay = document.getElementById("loading-overlay");
    const messageContainer = document.getElementById("task-message");
    const logoutBtn = document.getElementById('logout-btn');
    let currentTaskId = null;

    const TaskAPI = {
        async getTasks() {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                const response = await fetch(`${API_BASE}/tasks`, {
                    method: "GET",
                    headers: headers
                });
                if (!response.ok) throw new Error(response.statusText);
                return await response.json();
            } catch (error) {
                throw new Error("Network error: " + error.message);
            }
        },
        async createTask(data) {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                const response = await fetch(`${API_BASE}/tasks`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error(response.statusText);
                return await response.json();
            } catch (error) {
                throw new Error("Network error: " + error.message);
            }
        },
        async patchTask(id, data) {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                const response = await fetch(`${API_BASE}/tasks/${id}`, {
                    method: "PATCH",
                    headers: headers,
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error(response.statusText);
                return await response.json();
            } catch (error) {
                throw new Error("Network error: " + error.message);
            }
        },
        async deleteTask(id) {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                };
                const response = await fetch(`${API_BASE}/tasks/${id}`, {
                    method: "DELETE",
                    headers: headers
                });
                if (!response.ok) throw new Error(response.statusText);
                return await response.json();
            } catch (error) {
                throw new Error("Network error: " + error.message);
            }
        }
    };

    function renderTasks(tasks) {
        taskList.innerHTML = "";
        if (!Array.isArray(tasks)) {
            console.error("Expected an array of tasks, but received:", tasks);
            return;
        }
        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.className = `task-item flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all ${task.completed ? 'completed' : ''}`;
            taskElement.dataset.id = task.id;
            
            taskElement.innerHTML = `
                <div class="flex items-center space-x-4 flex-1">
                    <label class="custom-checkbox">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} class="hidden" data-action="toggle">
                        <div class="w-6 h-6 border-2 border-gray-400 rounded-md flex items-center justify-center transition-all">
                            <svg class="checkmark ${task.completed ? '' : 'hidden'} w-4 h-4 text-orange-400" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                    </label>
                    <div class="flex-1">
                        <h3 class="task-title font-semibold text-gray-100">${task.title}</h3>
                        ${task.description ? `<p class="task-desc text-gray-400 text-sm mt-1">${task.description}</p>` : ''}
                    </div>
                </div>
                <div class="flex items-center space-x-2 ml-4">
                    <button class="edit-btn px-3 py-1.5 rounded-md bg-white/10 text-gray-300 hover:bg-white/20 transition-all" data-action="edit">
                        <i class="fas fa-pencil-alt text-sm"></i>
                    </button>
                    <button class="delete-btn px-3 py-1.5 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all" data-action="delete">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(taskElement);
        });
        document.getElementById("task-count").textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;
    }

    taskList.addEventListener("click", async (e) => {
        const target = e.target.closest("[data-action]");
        if (!target) return;
        const taskElement = target.closest(".task-item");
        if (!taskElement) return;
        const taskId = taskElement.dataset.id;
        const action = target.dataset.action;
        try {
            switch (action) {
                case "edit":
                    handleEdit(taskElement);
                    break;
                case "delete":
                    await TaskAPI.deleteTask(taskId);
                    taskElement.remove();
                    showMessage("Task deleted", "success");
                    break;
            }
        } catch (error) {
            showMessage(error.message, "error");
        }
    });

    taskList.addEventListener("change", async (e) => {
        const input = e.target;
        if (input.dataset.action === "toggle") {
            const taskElement = input.closest(".task-item");
            const taskId = taskElement.dataset.id;
            const completed = input.checked;
            try {
                await TaskAPI.patchTask(taskId, { completed });
                taskElement.classList.toggle("completed", completed);
                taskElement.querySelector(".checkmark").classList.toggle("hidden", !completed);
                showMessage("Task updated", "success");
            } catch (error) {
                input.checked = !completed;
                showMessage(error.message, "error");
            }
        }
    });

    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(taskForm);
        const title = formData.get("title").trim();
        const description = formData.get("description").trim();
        if (!title) {
            showMessage("Title is required", "error");
            return;
        }
        showLoading(true);
        try {
            const taskData = { title, description };
            if (currentTaskId) {
                await TaskAPI.patchTask(currentTaskId, taskData);
                showMessage("Task updated", "success");
            } else {
                await TaskAPI.createTask(taskData);
                showMessage("Task created", "success");
            }

            await refreshTasks();
            taskForm.reset();
            currentTaskId = null;
            document.getElementById("submit-task").textContent = "Add Task";
        } catch (error) {
            showMessage(error.message, "error");
        } finally {
            showLoading(false);
        }
    });

    function handleEdit(taskElement) {
        const title = taskElement.querySelector(".task-title").textContent;
        const description = taskElement.querySelector(".task-desc")?.textContent || "";
        document.getElementById("task-title").value = title;
        document.getElementById("task-desc").value = description;
        currentTaskId = taskElement.dataset.id;
        document.getElementById("submit-task").textContent = "Update Task";
        taskForm.scrollIntoView({ behavior: "smooth" });
    }

    async function refreshTasks() {
        showLoading(true);
        try {
            const apiResponse = await TaskAPI.getTasks();
            const tasks = apiResponse.tasks || [];
            renderTasks(tasks);
        } catch (error) {
            showMessage(error.message, "error");
        } finally {
            showLoading(false);
        }
    }

    function showLoading(show = true) {
        const loadingOverlay = document.getElementById("loading-overlay");
        loadingOverlay.style.display = show ? "flex" : "none";
        
        if (show) {
            const progress = document.querySelector(".loading-progress");
            progress.style.width = "0%";
            let width = 0;
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                } else {
                    width += 10;
                    progress.style.width = width + "%";
                }
            }, 200);
        }
    }

    function showMessage(message, type = "success") {
        messageContainer.innerHTML = `
            <div class="p-3 rounded-lg ${type}-message animate-fade-in">${message}</div>
        `;
        setTimeout(() => {
            messageContainer.classList.add('animate-fade-out');
            setTimeout(() => messageContainer.innerHTML = '', 500);
        }, 2500);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
            showMessage('Logged out successfully', 'success');
        });
    }
    refreshTasks();
});