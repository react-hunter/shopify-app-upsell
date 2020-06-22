import React from 'react';
import Switch from 'react-switch';
import './ToggleSwitch.scss';

const ToggleSwitch = ({ value, onChange }) => {
  return (
    <div className="ToggleSwitch">
      <Switch
        height={16}
        uncheckedIcon={false}
        checkedIcon={false}
        width={34}
        onChange={onChange}
        checked={value}
        offColor="#FFFFFF"
        onColor="#5D6BC5"
      />
    </div>);
};

export default ToggleSwitch;
