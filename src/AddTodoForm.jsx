function AddTodoForm(props) {

    function handleAddTodo(event) {
        event.preventDefault();
        const todoTitle = event.target.elements.title.value;
        console.log("this is todoTitle:", todoTitle);

        event.target.reset();

        props.onAddTodo(todoTitle);
    }

    return (

        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Title</label>
            <input id="todoTitle" name="title"></input>
            <button type="submit">Add</button>

        </form>
    )

}



export default AddTodoForm;