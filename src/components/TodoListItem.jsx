import PropTypes from "prop-types";
import style from "./TodoListItem.module.css";

function TodoListItem({ todo, onRemoveTodo }) {
  const handleRemove = () => {
      const audio = new Audio('/trashSound.wav');
      audio.play();

      onRemoveTodo(todo.id);
  };

  return (
      <li className={style.ListItem}>
          {todo.title}
          <button type="button" className={style.RemoveButton} onClick={handleRemove}>
              Remove
          </button>
      </li>
  );
}

TodoListItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,  
    title: PropTypes.string.isRequired  
  }).isRequired,
  onRemoveTodo: PropTypes.func.isRequired  
};

export default TodoListItem;
