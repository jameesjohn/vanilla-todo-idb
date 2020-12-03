# Todo App -- IDB

In this tutorial, we are going to be creating a todo application whose data will be stored in indexedDB.

## What is IndexedDB

IndexedDB is a database solution which is available on the browser. It gives us the ability to store data on the client's browser.

## How does IndexedDB vs Local Storage

IndexedDB allows storage of binary files, while local storage does not.
IndexedDB allows storage of large files, while local storage does not. In fact, only strings can be stored in local storage, hence, to store anything in local storage, it needs to be stringified (converted to a string). With IndexedDB, you are allowed to store what ever you want.
And yes, you require permissions from the user to be able to access and use indexedDB on their browsers.
This is because, it might be possible to store malicious content, and to prevent that, the user has to manually accept or decline your application's access to the database.

## Prerequisites

For this tutorial, I'm assuming the following:

1. Basic knowledge of HTML and CSS
2. Basic knowledge of Javascript (ES6). I will be using ES6 here because ... why not!?

## Building the UI

While building this, I want to keep it simple so that we can focus primarily on the integration with indexedDB, hence, we are not using any frameworks.

Create a new folder which will house the files for this project.

```bash
mkdir todo-idb && cd todo-idb
```

Create a html file, index.html, and add the following to the file.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Todo -- IDB</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <main>
      <h1>My Todo List</h1>

      <form>
        <input
          type="text"
          name="new-todo"
          id="new-todo"
          placeholder="Type new item... "
        />
        <button type="submit">Add</button>
      </form>

      <ul class="todo-list">
        <li><input type="checkbox" /> <span>First item to be done</span></li>
        <li><input type="checkbox" /> <span>Second item to be done</span></li>
        <li class="done">
          <input type="checkbox" checked />
          <span> Third item to be done</span>
        </li>
      </ul>
    </main>

    <script src="./index.js"></script>
  </body>
</html>
```

The above just creates a barebones structure for the Todo application. We have a form element which contains an input field where the user will type the todo to be created.
The form also contains a submit button which when clicked should add the item in the input field to the todo list.

Right below the form is an unordered list which will contain all our todos.
Each list item has a checkbox which when checked, should signify that the todo has been completed.

Next let's add some styles to make the todo list look good.

Create a `style.css` file and add the following to it.

```css
body {
  display: flex;
  justify-content: center;
}
main {
  margin-top: 20px;
  width: 40vw;
  border: solid 1px #dddddd;
  padding: 15px;
  box-shadow: 0 0 3px #dddddd;
  border-radius: 5px;
}
h1 {
  text-align: center;
}
form {
  display: flex;
  justify-content: space-between;
}
form input {
  width: 450px;
  height: 20px;
  padding: 10px;
  border-radius: 5px;
  border: solid 1px #aaaaaa;
}
form button {
  padding: 5px 25px;
  border-radius: 5px;
  border: solid 1px #dddddd;
}
ul {
  padding: 0;
}
.done {
  background-color: #efefef;
  cursor: default;
}
.done:hover {
  box-shadow: 0 0 3px #dddddd;
}
.done span {
  text-decoration: line-through;
}
li {
  list-style: none;
  display: flex;
  margin-bottom: 15px;
  align-items: center;
  box-shadow: 0 0 3px #dddddd;
  padding-left: 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: box-shadow 200ms;
}
li:hover {
  box-shadow: 0 0 15px #cccccc;
}
li span {
  width: 100%;
  padding: 15px;
}
```

With that, the bare bones of the user interface has been built.
Next, we add functionality to the todo app.

## Adding Functionalities

Right now, our app is static, and we need to make it dynamic.
First, we need render the available todos from javascript.

Our todos will be an object that has a completed property and a data property.

```javascript
{ completed: false, data: 'First item to be done' },
```

To render the available todos in javascript, we need to create a function that will accept an array of todos to be displayed.

Create a new file, index.js, and add the following:

```javascript
function displayTodos(allTodos) {
  // Get the Ul containing all todos.
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
      // TODO: Handle checkbox checked or unchecked.
    });

    li.appendChild(checkBox);
    li.appendChild(span);

    todoContainer.appendChild(li);
  });
}
```

The above `displayTodos` function accepts an array of Todos, loops through them, creating a list, span and a checkbox in the process, then appends the list to the ul. This function will be called whenever there is a change to a todo, so that the UI will always reflect what got happened.
Imagine it as a render function in React or Vue.

Next, we need to call the function to display the TODOs. Add the following at the bottom of `displayTodos`.

```javascript
const availableTodos = [
  { completed: false, data: 'First item to be done' },
  { completed: false, data: 'Second item to be done' },
  { completed: true, data: 'Third item to be done' },
];
displayTodos(availableTodos);
```

With this, we now listing all TODOs via javascript and our app is in the process of becoming dynamic. Awesome!

## Add Todo functionality

The next step is to be able to add a todo from the input field.

For this, we need to be able to get the new todo item after the user has typed it into the input field, and `push` it to the `availableTodos` array.

Let's create a new function to handle those.

```javascript
/**
 * Add a new todo after the user submits the form.
 * @param {Event} event
 */
function addNewTodo(event) {
  event.preventDefault();
  const inputField = document.querySelector('#new-todo');
  const newTodo = inputField.value;
  if (newTodo.trim()) {
    availableTodos.push({ completed: false, data: newTodo.trim() });
    displayTodos(availableTodos);
    inputField.value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Add event listeners after the DOM has been fully loaded.
  document
    .querySelector('#add-todo-form')
    .addEventListener('submit', addNewTodo);
});
```

Here, we are listening for the `DOMContentLoaded` event, and only then do we add the event listener for the form submit. This is done to prevent the error of running the script and the the form has not yet been created.

The addNewTodo function receives the event as a parameter, and prevents the default execution (reloading the page, etc.), then gets the value that got entered in the input field.

We're doing some validation to check that the user actually typed something and not just spaces with `newTodo.trim()`. If the data passes the validation, we create a new todo object with its completed state set as false, and data the trimmed entry in the input field. Then we call `displayTodos` to rerender the todo list.

The next functionality to be added is the ability to set a todo as completed.
For this, we need to listen for a change event on the checkbox and update the todo object appropriately.

In the `displayTodo` function, modify the line that adds an event listener on the checkbox.

```javascript
function displayTodos(allTodos) {
  ...
  allTodos.forEach((todo) => {
    ...

    checkBox.addEventListener('change', () => {
      updateTodoCompleteState(todo);
    });
  })
  ...
}

function updateTodoCompleteState(todo) {
  todo.completed = !todo.completed;
  displayTodos(availableTodos);
}
```

Here, we listen for the change event on the checkbox, and call `updateTodoCompleteState` passing the **todo** as an argument.
`updateTodoCompleteState` receives the todo, updates the completed state and rerenders the todo list.

At this state, we have a functioning todo list, Hurray!!!
However, the state is not persisted, and when we reload the page, the data gets overwritten.

## Persisting Todo Data

To fix the issue of persistent state, we are going to store the todoData using IndexedDB.

With indexedDB, we can perform all the CRUD (Create, Read, Update and Delete) operations.

Currently in our application, we are storing all the todos in an array, which is held in memory, and when the user refreshes the page or moves to a different page, all the data gets cleared. To fix that, we are going to store all the data in indexedDB.

Data in indexedDB are stored in object stores. Object stores are similar to tables in a relational database, and collections in a NoSQL database.

Let's create our database and object store.

```javascript
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
```

In the snippet above, we are creating an indexedDB database named `TodoDB`, and setting it's version to 1.
IndexedDB is event driven, this means that events are triggered to signify various states in the lifecycle of a request.
When opening a database, a number of events could be triggered

- error: This is triggered when something went wrong while attempting to open a database.
- upgradeneeded: This is triggered when opening a DB for the first time, or when opening a DB with a different version. Object stores can only be created in response to the **upgradeneeded** event.
- success: This is triggered after the DB has been successfully opened. Once this has been triggered, the DB is safe to be read from.
- blocked: This is triggered if there is a version change transaction, on an already opened database.

When the `upgradeneeded` event gets triggered, we create an object store, todos, set it to auto increment the IDs and store them as an `id` property on the object which will be stored in the database. You could also set the IDs to be stored with some other name, but for consistency, I chose to name it `id`. This will only run once in the lifetime of the database.

When the `success` event gets triggered, we get the database object, and pass it as a parameter to the `getTodosAndUpdateDom` function which will be defined below.

```javascript
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
```

### Reading from IndexedDB

The `getTodosAndUpdateDom` receives an indexedDB database object, and uses it to fetch all the todos from the `todos` object store.
In indexedDB, all operations are carried out as a database transaction. The difference between this and a normal database transaction is that committing the transaction and closing the transaction is handled automatically.
Hence, to get the todos from indexedDB, we need to create a DB transaction. When creating an indexedBD transaction, we specify the name of the object store for which the transaction will be carried upon, and we specify the transaction mode.
The supported transaction modes are `readonly`, `readwrite`, and `versionchange`. A readonly transaction mode allows reading from the object store, but no writes. If you start a readonly transaction, you won't be able to update the data or add new data in that transaction.
A readwrite transaction as the name specifies allows the reading from and writing to the object store.
A versionchange on the other hand allows any kind of operation to be performed, including deleting and creating object stores. Versionchange transactions should not happen concurrently with another type of transaction.

After creating the transaction, we get the object store from the transaction. I know it looks like a redundancy specifying the object store when starting the transaction, and also getting the object store via `transaction.objectStore()`. This is because when starting the transaction, you can specify more than one object stores. Then when getting the object store, you get one specific store for which a specific operation will be carried out on.
For this function, what we want to do is to get all the data from the object store and show them on the UI. for this, we call `objectStore.getAll()`.

As with other indexedDB operations, this request is event driven. Possible events to be fired here are success and error, and the events are fired as their name implies. A success event is fired if the request completed successfully, while an error event is fired if the request failed.

When the success event gets fired, we update the DOM using the same `displayTodos` function that was already used for this purpose.

If the request fails, we log the failure to the console and we retry the transaction.

### Storing Todo Data to IndexedDB

Let's create a new function to handle storing todos to indexedDB.

```javascript
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
```

Here, we open the database, and start a readwrite transaction. It is important to set the transaction mode to readwrite since we want to add (write) data to the object store.

Then, we get the object store, and using the `add` method, we pass in the newly created todo which was received as a parameter to the storeTodo function.

Adding an item to the database returns an IDB Request, which is an event target, and on when the success event gets fired, we update the DOM by calling `getTodosAndUpdateDom` which was created in the previous section.

If anything goes wrong while performing the add operation, we log the error to console.

To use this new function, we need to update the `addNewTodo` handler to call `storeTodo` instead of manually pushing the new todo to the `availableTodos` array.

```javascript
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
```

Update the `addNewTodo` function to look like the above snippet.

### Marking a Todo as Complete (Updating Todos)

Let's create a function to handle updating Todo in indexedDB.

```javascript
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
```

The update function is very similar to the store function. The only difference is that when storing the todo, we use `objectStore.add`, while when updating, we use `objectStore.put`.
objectStore.put accepts an object with a key which used to relate it with a record in the object store. In our case, the keys are stored on the objects directly, hence we don't need to pass the key to the `put` method.

Finally, we update the updateTodoCompleteState function to use the new updateTodo function.

Modify `updateTodoCompleteState` to look like the following:

```javascript
function updateTodoCompleteState(todo) {
  todo.completed = !todo.completed;
  updateTodo(todo);
}
```

With that update, we have completely made a todo app with data stored in indexedDB!
Congratulations!!

## Conclusion

To read more about indexedDB, visit [MDN docs on indexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). If you do not like the event nature of indexedDB, [Jake Archibald](https://twitter.com/jaffathecake) created a [simple library](https://github.com/jakearchibald/idb) for it that uses promises.

The source code for this application can be found at ...
