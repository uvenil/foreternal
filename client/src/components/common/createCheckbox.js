// Benötigt eventHandler-Funktion toggleCheckbox!:
// Aufruf mit Parameter (id) toggled Checkbox (ändert seleted-Array)
// Aufruf mit Parameter (null)! liefert Set selected-Checkboxes

import React from 'react';
import PropTypes from 'prop-types';

export const Checkbox = ({ 
  id, 
  label, 
  name, 
  toggleCheckbox, 
}) => (
  <div className="checkbox">
    <input
      checked={toggleCheckbox(null).has(id)} 
      id={id}
      name={name}
      onChange={() => toggleCheckbox(id)}
      type="checkbox"
      value={id}
    />
    <label htmlFor={id}>{label}</label>
  </div>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  toggleCheckbox: PropTypes.func.isRequired,
};

const createCheckbox = toggleCheckbox => (id, name="standard", label="") => (
  <label key={String(id)} className="strong" htmlFor={String(id)}>
    <Checkbox
      className="strong"
      display="inline"
      id={String(id)}
      key={String(id)}
      label={label}
      name={name}
      toggleCheckbox={toggleCheckbox}
    />
  </label>
)

export default createCheckbox;
