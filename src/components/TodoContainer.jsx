import { useState, useEffect } from 'react'; 
import PropTypes from 'prop-types';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './TodoContainer.css';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

function TodoContainer({ tableName }) {
  const [todoList, setTodoList] = useState(() => {
    const saved = localStorage.getItem('savedTodoList');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAscending, setIsAscending] = useState(true);

  // Base URL for Airtable API
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${tableName}`;
  
  // Headers for API requests
  const headers = {
    'Authorization': `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const sortTodos = (todos) => {
    return [...todos].sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      return isAscending ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });
  };

  // Save todoList to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('savedTodoList', JSON.stringify(todoList));
    }
  }, [todoList, isLoading]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${url}?view=Grid%20view`, { 
          method: 'GET', 
          headers 
        });
        
        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        const todos = data.records.map(record => ({
          title: record.fields.title,
          id: record.id,
        }));

        setTodoList(sortTodos(todos));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [url]);

  async function addTodo(todoItem) {
    console.log('Adding todo:', todoItem);
    try {
      // Create the record in Airtable
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          records: [{
            fields: {
              title: todoItem.title
            }
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Response from Airtable:', data);
      
      if (!data.records || data.records.length === 0) {
        throw new Error('No record was created');
      }

      const newTodo = {
        title: data.records[0].fields.title,
        id: data.records[0].id
      };

      setTodoList(sortTodos([...todoList, newTodo]));
    } catch (error) {
      console.error("Error adding todo:", error);
      alert('Failed to add todo. Please try again.');
    }
  }

  async function removeTodo(id) {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      await response.json();
      setTodoList(todoList.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing todo:", error);
      alert('Failed to remove todo. Please try again.');
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="todoBox">
              <h1>THINGS TO DO</h1>
              <button className="toggleButton" onClick={() => setIsAscending(!isAscending)}>
                Sort {isAscending ? "Z-A" : "A-Z"}
              </button>
              <AddTodoForm onAddTodo={addTodo} />
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <TodoList todoList={todoList} onRemoveTodo={removeTodo} />
              )}
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

TodoContainer.propTypes = {
  tableName: PropTypes.string.isRequired,
};

export default TodoContainer;
