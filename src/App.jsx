import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import TodoContainer from './components/TodoContainer';
import './App.css';

function App() {
  const tableName = import.meta.env.VITE_TABLE_NAME;

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="landing-page">
              <Link to="/todo-list" className="open-button">
                OPEN THINGS TO DO LIST
              </Link>
            </div>
          } 
        />
        <Route 
          path="/todo-list" 
          element={<TodoContainer tableName={tableName} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
