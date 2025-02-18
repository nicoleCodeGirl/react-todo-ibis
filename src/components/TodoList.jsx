import React from "react";
import PropTypes from "prop-types";
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

TodoList.propTypes = {
  todoList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,  
      title: PropTypes.string.isRequired  
    })
  ).isRequired,
  onRemoveTodo: PropTypes.func.isRequired  
};

export default TodoList;
