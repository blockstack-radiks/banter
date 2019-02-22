import React from 'react';
import { Box, Flex, Type } from 'blockstack-ui';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { User } from 'radiks';
import Message from '../models/Message';
import { Card } from '../components/card';
import Feed from '../components/feed';
import { AppContext } from '../common/context/app-context';
import { Avatar } from '../components/avatar';

class Home extends React.Component {
  static propTypes = {
    rawMessages: PropTypes.array.isRequired,
  };

  static getInitialProps = async (ctx) => {
    console.log(ctx);

    const username = ctx.req ? ctx.req.params.username : ctx.query.username;

    const createdBy = username.replace('::]', '');
    const user = await User.findById(createdBy, { decrypt: false });
    const rawMessages = await Message.fetchList(
      {
        createdBy,
        sort: '-createdAt',
        limit: 10,
      },
      { decrypt: false }
    );

    return {
      rawMessages,
      user,
    };
  };

  render() {
    const { rawMessages, user } = this.props;
    return (
      <>
        <Head>
          <title>{user.attrs.username} - Banter</title>
        </Head>
        <Flex maxWidth={700} width={1} mx="auto" flexDirection={['column', 'row']}>
          <Box>
            <Card width={['100%', 200]} mx={0} p={4}>
              <Box>
                <Avatar username={user.attrs.username} size={96} mx="auto" />
              </Box>
              <Box pt={4} fontWeight="bold" textAlign="center">
                <Type color="purple">{user.attrs.username.split('.')[0]}</Type>
              </Box>
            </Card>
          </Box>
          <Box ml={[0, 3]} width={1} flexGrow={1}>
            <Feed borderTop={0} hideCompose rawMessages={rawMessages} createdBy={user.attrs.username} />
          </Box>
        </Flex>
      </>
    );
  }
}

Home.contextType = AppContext;

export default Home;
