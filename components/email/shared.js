import React from 'react';
import { Type, Flex, Box } from 'blockstack-ui';
import Linkify from 'linkifyjs/react';
import { appUrl } from '../../common/utils';
import { Avatar } from '../avatar';

const Table = (props) => <Box {...props} is="table" />;
const TBody = (props) => <Box is="tbody" {...props} />;
const TR = (props) => <Box is="tr" {...props} />;
const TD = (props) => <Box is="td" {...props} />;
const Row = ({ children, ...p }) => <TR {...p}>{children}</TR>;
const Section = (p) => <TD {...p} />;

const Container = ({ children, ...props }) => (
  <Table {...props}>
    <TBody>{children}</TBody>
  </Table>
);

const Block = ({ ...rest }) => (
  <Container width={1}>
    <Row>
      <Section>
        <Box width={1} {...rest} />
      </Section>
    </Row>
  </Container>
);

const TextBlock = ({ ...rest }) => (
  <Block>
    <Type is="p" p={0} m={0} display="block" {...rest} />
  </Block>
);

const Link = ({ ...rest }) => <Type is="a" color="purple" {...rest} />;

const Author = ({ author }) => (
  <Flex alignItems="center">
    <Box pr={2}>
      <Avatar size={32} username={author} />
    </Box>
    @{author}
  </Flex>
);

const Hr = () => (
  <Block>
    <Box is="hr" border="1px solid" borderColor="purple" />
  </Block>
);

const MessageContent = ({ children }) => (
  <Linkify
    options={{
      format: (value) => {
        return (
          <Type is="span" display="inline" style={{ wordBreak: 'break-all' }}>
            {value}
          </Type>
        );
      },
      formatHref: (href, type) => {
        if (type === 'mention') {
          return `${appUrl()}/[::]${href.slice(1)}`;
        }
        return href;
      },
      defaultProtocol: 'https',
    }}
  >
    {children}
  </Linkify>
);

const Message = ({ message, isLast, ...rest }) => (
  <Link
    display="block"
    width={1}
    href={`${appUrl()}/messages/${message._id}`}
    style={{ textDecoration: 'none' }}
    {...rest}
  >
    <Block
      bg="white"
      p={2}
      mb={!isLast ? 4 : 0}
      borderRadius="4px"
      border="1px solid rgb(224, 230, 234)"
      boxShadow="0px 4px 4px rgba(0,0,0,0.03)"
    >
      <Container width={1} pb={2}>
        <Row width={1}>
          <Section>
            <Author author={message.attrs.createdBy} />
          </Section>
          <Section align="right">
            <Type fontSize={0} mr={1}>
              {(message.attrs.votes && message.attrs.votes.length) || 0}
            </Type>
            💩
          </Section>
        </Row>
      </Container>
      <MessageContent>{message.attrs.content}</MessageContent>
    </Block>
  </Link>
);

const Footer = ({ ...rest }) => (
  <Block pt={4} {...rest}>
    <TextBlock width={1} textAlign="center">
      <Link href={appUrl()}>Come back to Banter</Link>
    </TextBlock>
    <TextBlock width={1} textAlign="center">
      <Link href={`${appUrl()}/settings`}>Change your Notification Preferences</Link>
    </TextBlock>
  </Block>
);

const Header = ({ user, title }) => (
  <Container width={1}>
    <Row width={1}>
      <Section>
        <Type pb={2} m={0} is="h1" color="purple">
          {title}
        </Type>
      </Section>
      <Section align="right">
        <Link href={`${appUrl()}/[::]${user.username}`}>
          <Avatar username={user.username} />
        </Link>
      </Section>
    </Row>
  </Container>
);

export { Block, TextBlock, Link, Author, Hr, Table, TBody, TR, TD, Row, Section, Container, Message, Header, Footer };
