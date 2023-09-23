import React from 'react';
import '../styles/ToggleSwitch.css'

const ToggleSwitch = ({ isOn, handleToggle }) => {
  return (
    <label className={`switch ${isOn ? 'admin' : 'client'}`} onClick={handleToggle}>
      <span className='slider'></span>
      <span className={`label ${isOn ? 'admin' : 'client'}`}>{isOn ? 'ADMIN' : 'CLIENT'}</span>
    </label>
  );
};

export default ToggleSwitch