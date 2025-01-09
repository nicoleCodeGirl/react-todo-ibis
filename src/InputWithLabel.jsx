import React, { useRef, useEffect } from 'react';

const InputWithLabel = (props) => {
    const { todoTitle, handleTitleChange, children } = props;

    // Create an imperative ref named inputRef
    const inputRef = useRef();

    // Define a useEffect without a dependency list
    useEffect(() => {
        // Call the focus() method on the current inputRef
        inputRef.current.focus();
    });

    return (
        <>
            <label htmlFor="todoTitle">{children}</label>
            <input
                id="todoTitle"
                name="title"
                value={todoTitle}
                onChange={handleTitleChange}
                ref={inputRef} // Add the ref prop
            />
        </>
    );
};

export default InputWithLabel;
