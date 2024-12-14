import { useState } from 'react';

function AddTodoForm({onAddTodo}) {

    const [todoTitle, setTodoTitle] = useState('');

    function handleTitleChange(event) {
        const newTodoTitle = event.target.value; // Retrieve input value
        setTodoTitle(newTodoTitle); // Update state
    }

    function handleAddTodo(event) {
        event.preventDefault();

        console.log("this is todoTitle:", todoTitle);

        // Removed the event.target.reset() call as instructed

        // Updated the onAddTodo callback to pass an object with title and id
        onAddTodo({ 
            title: todoTitle, // Set title to todoTitle
            id: Date.now() // Generate a unique identifier using Date.now()
        });

        setTodoTitle(""); // Reset todoTitle state to an empty string
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Title</label>
            <input
                id="todoTitle"
                name="title"
                value={todoTitle} // Controlled input value
                onChange={handleTitleChange} // onChange prop to be defined next
            />
            <button type="submit">Add</button>
        </form>
    );
}

export default AddTodoForm;
