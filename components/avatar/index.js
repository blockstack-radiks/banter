import React from 'react';
import { Box } from 'blockstack-ui';


const Avatar = ({ username, ...rest }) => (
  <Box
    size="42px"
    display="block"
    width="100%"
    background={`#f8a5c2 url(${`/api/avatar/${username}`}) center center no-repeat`}
    borderRadius="100%"
    overflow="hidden"
    style={{
      backgroundSize: 'cover',
    }}
    {...rest}
  />
);

export {Avatar};
