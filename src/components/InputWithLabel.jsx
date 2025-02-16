import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const InputWithLabel = ({ todoTitle, handleTitleChange, children }) => {
   
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <>
            <label htmlFor="todoTitle">{children}</label>
            <input
                id="todoTitle"
                name="title"
                value={todoTitle}
                onChange={handleTitleChange}
                ref={inputRef}
            />
        </>
    );
};

InputWithLabel.propTypes = {
    todoTitle: PropTypes.string.isRequired,  
    handleTitleChange: PropTypes.func.isRequired,  
    children: PropTypes.node.isRequired  
};

export default InputWithLabel;
