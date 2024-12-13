import React from 'react';
import TodoListItem from './TodoListItem';

const todoList = [
    {
      id: 1,
      title: "complete assignemt"
  
    },
    {
      id: 2,
      title: "update my resume"
    },
    {
      id: 3,
      title: "feed the cats"
    }
  ];

  
  function TodoList({ todoList }) {
    return (
        <ul>
            {todoList.map(item => (
                <TodoListItem key={item.id} todo={item} />
            ))}
        </ul>
        
    )
}






export default TodoList;