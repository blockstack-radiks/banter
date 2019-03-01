import React from 'react';
import { Box } from 'blockstack-ui';

const size = 42 * 3;

const imageUrl = (username) => `https://banter-pub.imgix.net/users/${username}?w=${size}&h=${size}&fit=crop&crop=faces,top,left`;

const Avatar = ({ username, ...rest }) => (
  <Box
    size="42px"
    display="block"
    flexShrink={0}
    width="100%"
    background={`#f8a5c2 url(${imageUrl(username)}) center center no-repeat`}
    borderRadius="100%"
    overflow="hidden"
    style={{
      backgroundSize: 'cover',
    }}
    {...rest}
  />
);

export {Avatar};
