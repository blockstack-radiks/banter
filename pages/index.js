import React from 'react';
import { Flex, Box } from 'rebass';
import Head from 'next/head';
import Feed from '../components/feed';

class Home extends React.Component {
  static getInitialProps = async ({ req, reduxStore }) => {
    const query = { fetcher: null };
    if (req && req.universalCookies && req.universalCookies.cookies && req.universalCookies.cookies.username) {
      query.fetcher = req.universalCookies.cookies.username;
    }
    await reduxStore.doFetchMessages(query);

    return {};
  };

  render() {
    return (
      <Flex>
        <Head>
          <title>Banter</title>
        </Head>
        <Box width={[1, 3 / 4]} mx="auto">
          <Feed />
        </Box>
      </Flex>
    );
  }
}

export default Home;
