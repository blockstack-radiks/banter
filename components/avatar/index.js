import Styled from 'styled-components';

export default Styled.img`
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  max-width: 100%;
`;
