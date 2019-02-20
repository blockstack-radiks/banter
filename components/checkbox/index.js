import React from 'react';
import { Box } from 'blockstack-ui';
import Type from '../../styled/typography';

// import { CheckboxContainer, HiddenCheckbox, StyledCheckbox, Icon } from './styled';

// const InnerCheckbox = ({ className, checked, ...props }) => (
//   <CheckboxContainer className={className}>
//     <HiddenCheckbox checked={checked} {...props} />
//     <StyledCheckbox checked={checked}>
//       <Icon viewBox="0 0 24 24">
//         <polyline points="20 6 9 17 4 12" />
//       </Icon>
//     </StyledCheckbox>
//   </CheckboxContainer>
// );

const Checkbox = ({ checked, onChange, children, name, ...props }) => (
  <Box {...props}>
    {/* <InnerCheckbox checked={checked} onChange={onChange} /> */}
    <input type="checkbox" name={name} checked={checked} onChange={onChange} />
    <Type.span ml={2} style={{ position: 'relative', top: '2px' }} as="label" htmlFor={name}>
      {children}
    </Type.span>
  </Box>
);

export default Checkbox;
