import React from 'react';

const Button = ({ name, label, ...others }) => {
  return (
    <button {...others} name={name} className="btn btn-success btn-lg">{label}</button>
  );
}

export { Button };