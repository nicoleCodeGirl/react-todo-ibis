import style from "./TodoListItem.module.css";

function TodoListItem({ todo, onRemoveTodo }) {
  return (
    <li className={style.ListItem}>
      {todo.title}
      <button type="button" className={style.RemoveButton} onClick={() => onRemoveTodo(todo.id)}>
        Remove
      </button>
    </li>
  );
}

export default TodoListItem;
