import styled from 'styled-components';
import { Type } from 'blockstack-ui';

export const MessageContent = styled(Type)`
  line-height: 1.45;
  color: #545454;
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
