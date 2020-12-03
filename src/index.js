/**
 *
 * @param {Object[]} allTodos
 */
function displayTodos(allTodos) {
  // Todos will be of the format: [{completed: false, data: 'some sample todo', id: 'random-string'}];
  const todoContainer = document.querySelector('.todo-list');

  // Clear the todo container
  todoContainer.innerHTML = '';

  allTodos.forEach((todo) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = todo.data;

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';

    if (todo.completed) {
      li.classList.add('done');
      checkBox.checked = true;
    }

    checkBox.addEventListener('change', () => {
      updateTodoCompleteState(todo);
    });

    li.appendChild(checkBox);
    li.appendChild(span);

    todoContainer.appendChild(li);
  });
}

function updateTodoCompleteState(todo) {
  todo.completed = !todo.completed;
  updateTodo(todo);
}

/**
 * Add a new todo after the user submits the form.
 * @param {Event} event
 */
function addNewTodo(event) {
  event.preventDefault();
  const inputField = document.querySelector('#new-todo');
  const newTodo = inputField.value;
  if (newTodo.trim()) {
    storeTodo({ completed: false, data: newTodo.trim() });
    inputField.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners after the DOM has been fully loaded.
  document
    .querySelector('#add-todo-form')
    .addEventListener('submit', addNewTodo);
  setupIndexedDB();
});

function setupIndexedDB() {
  const request = window.indexedDB.open('TodoDB', 1);
  request.addEventListener('error', () => {
    console.log('Unable to open database');
  });

  // Triggered only when opening db for the first time(when db is being created).
  request.addEventListener('upgradeneeded', (event) => {
    const db = request.result;
    // Create the object store. Can only be created here.
    // Keypath refers to the property on the object to which the key would be stored.
    db.createObjectStore('todos', { autoIncrement: true, keyPath: 'id' });
  });

  request.addEventListener('success', (event) => {
    // Database opened successfully
    const db = request.result;

    // Load todos from the database.
    getTodosAndUpdateDom(db);
  });

  request.addEventListener('blocked', (event) => {
    alert('Something went wrong, please reload the page');
  });
}

/**
 *
 * @param {IDBDatabase} db
 */
function getTodosAndUpdateDom(db) {
  const transaction = db.transaction('todos', 'readonly');
  const objectStore = transaction.objectStore('todos');
  const request = objectStore.getAll();
  request.addEventListener('success', (event) => {
    displayTodos(event.target.result);
  });

  request.addEventListener('error', (event) => {
    console.log('Unable to get todos', event.target.errorCode);
    console.log('Retrying...');
    getTodosAndUpdateDom(db);
  });
}

function storeTodo(todo) {
  const request = window.indexedDB.open('TodoDB', 1);
  request.addEventListener('success', () => {
    const db = request.result;
    const transaction = db.transaction('todos', 'readwrite');
    const objectStore = transaction.objectStore('todos');

    const storeRequest = objectStore.add(todo);

    storeRequest.addEventListener('success', () => {
      getTodosAndUpdateDom(db);
    });

    storeRequest.addEventListener('error', (event) => {
      console.log('Unable to add todo', event.target.errorCode);
    });
  });

  request.addEventListener('error', (event) => {
    console.log('Unable to open DB', event.target.errorCode);
  });
}

function updateTodo(todo) {
  const request = window.indexedDB.open('TodoDB', 1);
  request.addEventListener('success', (event) => {
    const db = request.result;

    const transaction = db.transaction('todos', 'readwrite');
    const objectStore = transaction.objectStore('todos');

    // We can do this here since the key is stored in the todo object.
    objectStore.put(todo);

    transaction.addEventListener('complete', () => {
      getTodosAndUpdateDom(db);
    });
  });

  request.addEventListener('error', (event) => {
    console.log('Unable to open DB');
  });
}
