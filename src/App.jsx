import { useState, useEffect } from 'react'; // Importing useEffect
import './App.css';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

function App() {
  const [todoList, setTodoList] = useState([]); // Default state is an empty array
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // Resolving with an object containing 'data' and 'todoList'
        resolve({ data: { todoList: [] } }); // Set todoList as an empty array here
      }, 2000); // 2-second delay
    })
      .then(result => {
        // After the Promise resolves, update the todoList with the todoList from the result object
        setTodoList(result.data.todoList);
      })
      .then(() => {
        // After updating the state, stop the loading spinner
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('savedTodoList', JSON.stringify(todoList));
    }
  }, [todoList, isLoading]);

  function addTodo(newTodo) {
    setTodoList([...todoList, newTodo]);
  }

  function removeTodo(id) {
    const updatedTodoList = todoList.filter(todo => todo.id !== id);
    setTodoList(updatedTodoList);
  }

  return (
    <>
      <h1>Todo List</h1>
      <AddTodoForm onAddTodo={addTodo} />
      {isLoading ? <p>Loading...</p> : <TodoList todoList={todoList} onRemoveTodo={removeTodo} />}
    </>
  );
}

export default App;
