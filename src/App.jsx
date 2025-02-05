import { useState, useEffect } from 'react'; // Importing useEffect
import './App.css';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  async function fetchData() {
    const options = {
      method: 'GET',
      headers
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();  // This variable holds the parsed response
      console.log(data);  // Print the data variable to observe the API response

      const todos = data.records.map(record => ({
        title: record.fields.Title,
        id: record.id
      }));

      setTodoList(todos);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function addTodo(newTodo) {
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        records: [{ fields: { Title: newTodo.Title } }]
      })
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();  // This variable holds the parsed response
      console.log(data);  // Print the data variable to observe the API response

      const addedTodo = {
        title: data.records[0].fields.Title,
        id: data.records[0].id
      };

      setTodoList([...todoList, addedTodo]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  // function removeTodo(id) {
  //   const updatedTodoList = todoList.filter(todo => todo.id !== id);
  //   setTodoList(updatedTodoList);
  //   localStorage.setItem('savedTodoList', JSON.stringify(updatedTodoList)); // Save updated list
  // }

  async function removeTodo(id) {
    const options = {
      method: 'DELETE',
      headers,
    };
  
    try {
      const response = await fetch(`${url}/${id}`, options); // Use Airtable's DELETE endpoint
      if (!response.ok) {
        throw new Error(`Error deleting record: ${response.status}`);
      }
  
      console.log(`Deleted record with ID: ${id}`);
      
      // Update state and local storage after successful deletion
      const updatedTodoList = todoList.filter(todo => todo.id !== id);
      setTodoList(updatedTodoList);
      localStorage.setItem('savedTodoList', JSON.stringify(updatedTodoList));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }
  


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('savedTodoList', JSON.stringify(todoList));
    }
  }, [todoList, isLoading]);

  return (
    <>
      <h1>Todo List</h1>
      <AddTodoForm onAddTodo={addTodo} />
      {isLoading ? <p>Loading...</p> : <TodoList todoList={todoList} onRemoveTodo={removeTodo} />}
    </>
  );
}

export default App;
