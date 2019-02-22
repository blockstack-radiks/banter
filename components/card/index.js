import React from 'react';
import { Box } from 'blockstack-ui';

const Card = ({ ...rest }) => (
  <Box
    border="1px solid rgb(230, 236, 240)"
    my={[2, 4]}
    mx={[2, 'auto']}
    maxWidth={600}
    bg="white"
    borderRadius={2}
    boxShadow="card"
    {...rest}
  />
);

export { Card };
