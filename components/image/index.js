import React from 'react';
import { Box } from 'blockstack-ui';
import styled from 'styled-components';

const ImageWrapper = styled(Box)`
  img.lazyloaded {
    opacity: 1 !important;

    & + img {
      opacity: 0 !important;
    }
  }
`;

const PreviewImage = ({ ...rest }) => (
  <Box transition="0.5s all ease-in-out 0.3s" width={1} is="img" display="block" maxWidth="100%" {...rest} />
);
const HighResImage = ({ ...rest }) => (
  <Box
    transition="0.5s all ease-in-out"
    opacity={0}
    position="absolute"
    left={0}
    top={0}
    width={1}
    is="img"
    display="block"
    maxWidth="100%"
    {...rest}
  />
);

const Image = ({ src, ...rest }) => {
  if (!src) return null;
  let url = src;
  if (src.url) {
    console.log(src);
    ({ url } = src);
  }
  const isImgix = url.includes('imgix');
  if (!isImgix) {
    return (
      <Box width={1}>
        <Box is="img" width={1} display="block" src={url} {...rest} />
      </Box>
    );
  }

  const highRes = `${url}?auto=format&fit=max&w=800`;
  const preview = `${url}?auto=format&w=100&blur=100`;

  return (
    <ImageWrapper width={1} position="relative" {...rest}>
      <HighResImage className="lazyload" data-src={highRes} />
      <PreviewImage src={preview} />
    </ImageWrapper>
  );
};

export { Image };
