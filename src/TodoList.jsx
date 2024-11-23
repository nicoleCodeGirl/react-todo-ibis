import React from 'react';

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

  
function TodoList () {

    return (
        
        <ul>
        {todoList.map(function(item){
          return <li key={item.id}>{item.title}</li>
        })}
      </ul>
        
    )
}






export default TodoList;