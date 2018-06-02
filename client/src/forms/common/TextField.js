import React from 'react';

const TextInput = ({ type, name, label, ...others }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input {...others} type={type} className="form-control form-control-lg rounded-0" name={name} id={name} />
        </div>
    );
}

export { TextInput };
