import React from 'react';
import { Box, Type } from 'blockstack-ui';

const Checkbox = ({ checked, onChange, children, name, inputProps = {}, ...props }) => (
  <Box {...props}>
    <input type="checkbox" name={name} checked={checked} id={name} onChange={onChange} {...inputProps} />
    <Type is="label" ml={2} style={{ position: 'relative', top: '2px' }} htmlFor={name}>
      {children}
    </Type>
  </Box>
);

export default Checkbox;
