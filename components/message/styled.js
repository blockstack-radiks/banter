import Styled from 'styled-components';
import { Type } from 'blockstack-ui';

export const MessageContent = Styled(Type)`
  a {
    color: ${({ theme }) => theme.colors.purple};
    font-weight: 500;
  }
`;

MessageContent.defaultProps = {
  color: 'gray',
};
