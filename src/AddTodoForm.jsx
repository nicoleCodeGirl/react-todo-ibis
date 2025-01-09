import { useState } from 'react';
import InputWithLabel from './InputWithLabel';

function AddTodoForm({onAddTodo}) {

    const [todoTitle, setTodoTitle] = useState('');

    function handleTitleChange(event) {
        const newTodoTitle = event.target.value; // Retrieve input value
        setTodoTitle(newTodoTitle); // Update state
    }

    function handleAddTodo(event) {
        event.preventDefault();

        console.log("this is todoTitle:", todoTitle);

        onAddTodo({ 
            title: todoTitle, // Set title to todoTitle
            id: Date.now() // Generate a unique identifier using Date.now()
        });

        setTodoTitle(""); // Reset todoTitle state to an empty string
    }

    return (
        <form onSubmit={handleAddTodo}>
           <InputWithLabel 
                todoTitle={todoTitle} 
                handleTitleChange={handleTitleChange}>
                Title
            </InputWithLabel>
            <button type="submit">Add</button>
        </form>
    );
}

export default AddTodoForm;
