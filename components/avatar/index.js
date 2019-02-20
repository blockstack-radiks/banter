import Styled from 'styled-components';

export default Styled.img`
  border-radius: 50%;
  max-width: ${({ size, }) => size};
  max-height: ${({ size, }) => size};
  max-width: 100%;
`;
