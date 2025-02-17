import { useState, useEffect } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAscending, setIsAscending] = useState(true); // State to track sort order

  // Base URL for Airtable API
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  
  // Headers for API requests
  const headers = {
    Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  // Fetch data from Airtable with sorting
  async function fetchData() {
    const options = {
      method: 'GET',
      headers,
    };

    const view = "Grid%20view"; // Define the Airtable view name

    // Option 1: Sorting using Airtable query parameters (ascending order)
    // const fetchUrl = `${url}?view=${view}&sort[0][field]=title&sort[0][direction]=asc`; 

    // Option 2: Sorting using Airtable query parameters (descending order)
    // const fetchUrl = `${url}?view=${view}&sort[0][field]=title&sort[0][direction]=desc`;

    // Option 3: Base fetch URL without sorting (for JavaScript-based sorting)
    const fetchUrl = `${url}?view=${view}`; 

    try {
      const response = await fetch(fetchUrl, options); // Use the updated URL
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json(); // Parse the response

      // Option 3: Sort the records by Title field in ascending order (A-to-Z) using JavaScript
      /*
      data.records.sort((objectA, objectB) => {
        const titleA = objectA.fields.title.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        const titleB = objectB.fields.title.toLowerCase();
        if (titleA < titleB) return -1; // Title A comes before Title B
        if (titleA > titleB) return 1;  // Title A comes after Title B
        return 0;                       // Titles are equal
      });
      */

      // Option 4: Sort the records by Title field in descending order (Z-to-A) using JavaScript
      data.records.sort((objectA, objectB) => {
        const titleA = objectA.fields.title.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        const titleB = objectB.fields.title.toLowerCase();
        if (titleA < titleB) return isAscending ? -1 : 1;   // Ascending or Descending based on isAscending state
        if (titleA > titleB) return isAscending ? 1 : -1;   // Ascending or Descending based on isAscending state
        return 0;                        // Titles are equal
      });

      console.log(data); // Observe the API response

      const todos = data.records.map(record => ({
        title: record.fields.title,
        id: record.id,
      }));

      setTodoList(todos);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Add a new todo to Airtable
  async function addTodo(newTodo) {
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        records: [{ fields: { title: newTodo.title } }]
      })
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json(); // Parse the response

      const addedTodo = {
        title: data.records[0].fields.title,
        id: data.records[0].id
      };

      setTodoList([...todoList, addedTodo]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  // Remove a todo from Airtable
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

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [isAscending]); // Re-fetch data when sort order changes

  // Store todoList in local storage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('savedTodoList', JSON.stringify(todoList));
    }
  }, [todoList, isLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="todoBox">
              <h1>Todo List</h1>
              {/* Toggle button to switch between ascending and descending sort */}
              <button className="toggleButton" onClick={() => setIsAscending(!isAscending)}>
                Switch to {isAscending ? "Z-A" : "A-Z"}
              </button>
              <AddTodoForm onAddTodo={addTodo} />
              {isLoading ? <p>Loading...</p> : <TodoList todoList={todoList} onRemoveTodo={removeTodo} />}
            </div>
          }
        />
        <Route 
          path="/new" 
          element={<h1>New Todo List</h1>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
