import PropTypes from "prop-types";
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

TodoListItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,  
    title: PropTypes.string.isRequired  
  }).isRequired,
  onRemoveTodo: PropTypes.func.isRequired  
};

export default TodoListItem;
