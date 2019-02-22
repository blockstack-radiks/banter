import Styled from 'styled-components';
import { Type } from 'blockstack-ui';

export const MessageContent = Styled(Type)`
  a {
    color: ${({ theme }) => theme.colors.purple};
    font-weight: 500;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

MessageContent.defaultProps = {
  color: 'gray',
};
