import styled from 'styled-components';
import { baseProps } from './headings';

const P = styled.p`
  ${({ theme }) => baseProps(theme)};
`;

const Span = styled.span`
  ${({ theme }) => baseProps(theme)};
`;

const Body = styled.div`
  ${({ theme }) => baseProps(theme)};
`;

const Strong = styled.strong`
  ${({ theme }) => baseProps(theme)};
  font-weight: 500;
`;

const Em = styled.em`
  ${({ theme }) => baseProps(theme)};
`;
const Ul = styled.ul`
  ${({ theme }) => baseProps(theme)};
`;
const Ol = styled.ol`
  ${({ theme }) => baseProps(theme)};
`;

const Li = styled.li`
  ${({ theme }) => baseProps(theme)};
`;

const Pre = styled.pre`
  ${({ theme }) => baseProps(theme)};
`;

const Small = styled.small`
  font-size: 12px;
  ${({ theme }) => baseProps(theme)};
`;

Body.p = P;
Body.span = Span;
Body.strong = Strong;
Body.em = Em;
Body.ul = Ul;
Body.ol = Ol;
Body.li = Li;
Body.oli = Li;
Body.pre = Pre;
Body.small = Small;

export default Body;
