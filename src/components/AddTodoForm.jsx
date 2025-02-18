import { useState } from 'react';
import InputWithLabel from './InputWithLabel';
import PropTypes from "prop-types";

function AddTodoForm({onAddTodo}) {
    const [todoTitle, setTodoTitle] = useState('');

    function handleTitleChange(event) {
        setTodoTitle(event.target.value);
    }

    function handleAddTodo(event) {
        event.preventDefault();
        
        const audio = new Audio('/addItemSound.mp3');
        audio.play();

        if (todoTitle.trim()) {  
            onAddTodo({ 
                title: todoTitle,
                id: Date.now() 
            });
            setTodoTitle('');
        }
    }

    return (
        <form onSubmit={handleAddTodo}>
           <InputWithLabel 
                todoTitle={todoTitle} 
                handleTitleChange={handleTitleChange}>
                Title
            </InputWithLabel>
            <button className="addButton" type="submit">Add</button>
        </form>
    );
}

AddTodoForm.propTypes = {
    onAddTodo: PropTypes.func.isRequired
};

export default AddTodoForm;
