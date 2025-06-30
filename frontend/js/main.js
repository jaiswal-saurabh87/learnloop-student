document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Check ---
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // --- Element Selection ---
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.getElementById('main-content');
    const sidebarLinks = document.querySelectorAll('.sidebar-item a');
    const logoutBtn = document.getElementById('logout-btn');
    const exitBtn = document.getElementById('exit-btn');
    const headerTitle = document.getElementById('header-title');
    const themeToggle = document.getElementById('theme-toggle');

    // --- State ---
    let menuOpen = false;

    // --- Functions ---
    const toggleMenu = () => {
        menuOpen = !menuOpen;
        menuBtn.classList.toggle('open', menuOpen);
        sidebar.classList.toggle('open', menuOpen);
    };

    const loadPage = async (pageUrl) => {
        try {
            const res = await fetch(pageUrl);
            if (!res.ok) throw new Error('Page not found');
            mainContent.innerHTML = await res.text();
            
            // Update header title based on loaded page
            const pageName = pageUrl.split('.')[0];
            headerTitle.textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);

            // If the loaded page is todo.html, initialize its functionality
            if (pageUrl === 'todo.html') {
                initTodoApp();
            }
            // Add similar initializers for other pages (e.g., initChatApp())
        } catch (error) {
            mainContent.innerHTML = `<div class="page-container"><h2>Error</h2><p>${error.message}</p></div>`;
        }
    };

    const handleLinkClick = (e) => {
        e.preventDefault();
        const page = e.currentTarget.getAttribute('data-page');
        
        // Update active class
        sidebarLinks.forEach(link => link.parentElement.classList.remove('active'));
        e.currentTarget.parentElement.classList.add('active');
        
        loadPage(page);
        if (window.innerWidth <= 768) {
             toggleMenu();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    };

    const setupTheme = () => {
        const isDarkMode = localStorage.getItem('theme') === 'dark';
        document.body.classList.toggle('dark-theme', isDarkMode);
        themeToggle.checked = isDarkMode;
    };

    const toggleTheme = () => {
        const isDarkMode = themeToggle.checked;
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.body.classList.toggle('dark-theme', isDarkMode);
    };

    // --- Event Listeners ---
    menuBtn.addEventListener('click', toggleMenu);
    sidebarLinks.forEach(link => link.addEventListener('click', handleLinkClick));
    logoutBtn.addEventListener('click', logout);
    exitBtn.addEventListener('click', logout); // Exit button logs out
    themeToggle.addEventListener('change', toggleTheme);

    // --- Initial Load ---
    setupTheme();
    loadPage('dashboard.html');


    // ===============================================
    //      TO-DO LIST FUNCTIONALITY
    // ===============================================
    const initTodoApp = () => {
        const todoForm = document.getElementById('todo-form');
        const todoInput = document.getElementById('todo-input');
        const todoList = document.getElementById('todo-list');
        const token = localStorage.getItem('token');

        const api = {
            get: () => fetch('http://localhost:5000/api/todos', { headers: { 'x-auth-token': token } }).then(res => res.json()),
            add: (task) => fetch('http://localhost:5000/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ task })
            }).then(res => res.json()),
            delete: (id) => fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            }),
            update: (id, is_completed) => fetch(`http://localhost:5000/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ is_completed })
            }),
        };

        const renderTodos = async () => {
            const todos = await api.get();
            todoList.innerHTML = '';
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.className = `todo-item ${todo.is_completed ? 'completed' : ''}`;
                li.dataset.id = todo.id;
                li.innerHTML = `
                    <input type="checkbox" ${todo.is_completed ? 'checked' : ''}>
                    <span>${todo.task}</span>
                    <button class="delete-btn">&times;</button>
                `;
                todoList.appendChild(li);
            });
        };

        todoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const task = todoInput.value.trim();
            if (task) {
                await api.add(task);
                todoInput.value = '';
                await renderTodos();
            }
        });

        todoList.addEventListener('click', async (e) => {
            const li = e.target.closest('.todo-item');
            if (!li) return;
            const id = li.dataset.id;
            
            if (e.target.matches('.delete-btn')) {
                await api.delete(id);
                li.remove();
            } else if (e.target.matches('input[type="checkbox"]')) {
                const is_completed = e.target.checked;
                await api.update(id, is_completed);
                li.classList.toggle('completed', is_completed);
            }
        });

        renderTodos();
    };
});