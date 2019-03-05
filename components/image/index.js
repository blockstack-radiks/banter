import React, { useState, useEffect, useRef } from 'react';
import { Box } from 'blockstack-ui';

const Image = ({ src, ...rest }) => {
  const isImgix = src.includes('imgix');
  if (!isImgix) {
    return <Box is="img" src={src} {...rest} />;
  }

  const highRes = src + '?auto=format';
  const preview = src + '?auto=format&w=100&blur=100';

  return (
    <Box width={1}>
      <Box width={1} is="img" display="block" maxWidth="100%" src={preview} {...rest} />
    </Box>
  );
};

export { Image };
