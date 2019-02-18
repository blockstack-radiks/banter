import styled, { css } from 'styled-components';
import {
  color,
  fontSize,
  fontWeight,
  fontFamily,
  textStyle,
  textAlign,
  lineHeight,
  opacity,
  borders,
  borderRadius,
  width,
  maxWidth,
  display,
  space,
  fontStyle,
} from 'styled-system';

export const baseProps = () => css`
  ${color};
  ${fontSize};
  ${fontWeight};
  ${fontFamily};
  ${textStyle};
  ${lineHeight};
  ${opacity};
  ${textAlign};
  ${maxWidth};
  ${width};
  ${borders};
  ${display};
  ${borderRadius};
  ${maxWidth};
  ${space};
  ${fontStyle};
`;

const headerProps = theme => css`
  // font-family: 'Plex', monospace;
  font-weight: 500;
  ${baseProps(theme)};
`;

const H1 = styled.h1`
  ${({ theme }) => headerProps(theme)};
`;
const H2 = styled.h2`
  ${({ theme }) => headerProps(theme)};
`;
const H3 = styled.h3`
  ${({ theme }) => headerProps(theme)};
`;
const H4 = styled.h4`
  ${({ theme }) => headerProps(theme)};
`;
const H5 = styled.h5`
  ${({ theme }) => headerProps(theme)};
`;
const H6 = styled.h6`
  ${({ theme }) => headerProps(theme)};
`;

export {
  H1, H2, H3, H4, H5, H6,
};
