import { useState } from 'react'
import './App.css'
import TodoList from './TodoList'
import AddTodoForm from './AddTodoForm'

function App() {
  const [todoList, setTodoList] = useState([]); // State to manage the list of todos

  // Function to add a new todo to the list
  function addTodo(newTodo) {
    setTodoList([...todoList, newTodo]); // Spread operator to add the newTodo object to the existing todoList
  }

  return (
    <>
      <h1>Todo List</h1>
      {/* Updated the onAddTodo prop to use the addTodo function */}
      <AddTodoForm onAddTodo={addTodo} />
      {/* Removed the newTodo JSX element */}
      <TodoList todoList={todoList} />
    </>
  );
}

export default App;