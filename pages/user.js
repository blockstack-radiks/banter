import React from 'react';
import { Box, Flex, Type } from 'blockstack-ui';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Card } from '../components/card';
import Feed from '../components/feed';
import { fetchUser } from '../common/lib/api';

import { Avatar } from '../components/avatar';
import SocialAccounts from '../components/social-accounts';

class UserPage extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  static getInitialProps = async (ctx) => {
    const username = ctx.req ? ctx.req.params.username : ctx.query.username;

    const createdBy = username.replace('::]', '');
    // const user = await User.findById(createdBy, { decrypt: false });
    const user = await fetchUser(createdBy);

    const query = { fetcher: null, createdBy };
    const { req } = ctx;
    if (req && req.universalCookies && req.universalCookies.cookies && req.universalCookies.cookies.username) {
      query.fetcher = req.universalCookies.cookies.username;
    }
    await ctx.reduxStore.doFetchMessages(query);

    return {
      user,
    };
  };

  render() {
    const { user } = this.props;
    const { profile } = user.attrs;
    const hasName = profile.name && profile.name.length > 0;

    return (
      <>
        <Head>
          <title>{user.attrs.username} - Banter</title>
        </Head>
        <Flex maxWidth={600} width={1} mx="auto" flexDirection={['column', 'row']}>
          <Box>
            <Card my={0} width={['100%', 200]} mx={0} p={4} position="sticky" top="20px">
              <Box>
                <Avatar username={user.attrs.username} size={96} mx="auto" />
              </Box>
              <Box pt={4} fontWeight="bold" textAlign="center">
                {hasName && <Type color="purple" display="block">{profile.name}</Type>}
                <Type mt={hasName ? 3 : 0} fontSize={hasName ? 1 : 2} color="purple">
                  {user.attrs.username}
                </Type>
              </Box>
              <Box mt={5}>
                <SocialAccounts profile={profile} />
              </Box>
            </Card>
          </Box>
          <Box ml={[0, 3]} width={1} flexGrow={1}>
            <Feed borderTop={0} hideCompose createdBy={user.attrs.username} />
          </Box>
        </Flex>
      </>
    );
  }
}


export default UserPage;
