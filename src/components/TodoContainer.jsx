import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './TodoContainer.css';
import TodoList from './TodoList';
import AddTodoForm from './AddTodoForm';

function TodoContainer({ tableName }) {
  const navigate = useNavigate();

  const [todoList, setTodoList] = useState(() => {
    const saved = localStorage.getItem('savedTodoList');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false); // Start as false since we have cached data
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
    localStorage.setItem('savedTodoList', JSON.stringify(todoList));
  }, [todoList]);

  // Fetch latest data from Airtable
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
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    // Only show loading if we don't have cached data
    if (todoList.length === 0) {
      setIsLoading(true);
    }
    fetchData();
  }, [url, isAscending]);

  async function addTodo(todoItem) {
    // console.log('Adding todo:', todoItem);
    // console.log('API URL:', url);
    // console.log('Headers:', headers);
    
    try {
      const requestBody = {
        records: [{
          fields: {
            title: todoItem.title
          }
        }]
      };
      // console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      const responseText = await response.text();
      // console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${responseText}`);
      }

      const data = JSON.parse(responseText);
      // console.log('Parsed response:', data);
      
      if (!data.records || data.records.length === 0) {
        throw new Error('No record was created');
      }

      const newTodo = {
        title: data.records[0].fields.title,
        id: data.records[0].id
      };
      // console.log('Created new todo:', newTodo);

      setTodoList(prevList => sortTodos([...prevList, newTodo]));
    } catch (error) {
      console.error("Error adding todo:", error);
      console.error("Error details:", error.message);
      alert('Failed to add todo. Please try again. Error: ' + error.message);
    }
  }

  async function removeTodo(id) {
    // console.log('Removing todo with id:', id);
    try {
      const deleteUrl = `${url}/${id}`;
      // console.log('Delete URL:', deleteUrl);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_AIRTABLE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      // Remove from local state
      setTodoList(prevList => prevList.filter(item => item.id !== id));
      // console.log('Todo removed successfully');
    } catch (error) {
      console.error("Error removing todo:", error);
      alert('Failed to remove todo. Please try again.');
    }
  }

  return (
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
      <button className="closeButton" onClick={() => navigate('/')}>
        Close List
      </button>
    </div>
  );
}

TodoContainer.propTypes = {
  tableName: PropTypes.string.isRequired,
};

export default TodoContainer;
