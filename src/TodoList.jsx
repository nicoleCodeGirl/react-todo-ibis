import React from "react";
import TodoListItem from "./TodoListItem";
import style from "./TodoList.module.css"; // Importing as "style"

function TodoList({ todoList, onRemoveTodo }) {
  return (
    <ul className={style.TodoList}> 
      {todoList.map((item) => (
        <TodoListItem key={item.id} todo={item} onRemoveTodo={onRemoveTodo} />
      ))}
    </ul>
  );
}

export default TodoList;
