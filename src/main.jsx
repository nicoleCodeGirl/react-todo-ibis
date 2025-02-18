import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TodoContainer from './components/TodoContainer.jsx'

const tableName = import.meta.env.VITE_TABLE_NAME;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoContainer tableName={tableName} />
  </StrictMode>,
)
