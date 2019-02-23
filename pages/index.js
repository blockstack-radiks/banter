import React from 'react';
import { Flex, Box } from 'rebass';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Feed from '../components/feed';
import { AppContext } from '../common/context/app-context';
import { fetchMessages } from '../common/lib/api';

class Home extends React.Component {
  static propTypes = {
    rawMessages: PropTypes.array.isRequired,
  };

  static getInitialProps = async ({ req }) => {
    const query = { fetcher: null };
    if (req && req.universalCookies && req.universalCookies.cookies && req.universalCookies.cookies.username) {
      query.fetcher = req.universalCookies.cookies.username;
    }
    const rawMessages = await fetchMessages(query);
    console.log(rawMessages[0]);

    return {
      rawMessages,
    };
  };

  render() {
    const { rawMessages } = this.props;
    return (
      <Flex>
        <Head>
          <title>Banter</title>
        </Head>
        <Box width={[1, 3 / 4]} mx="auto">
          <Feed rawMessages={rawMessages} />
        </Box>
      </Flex>
    );
  }
}

Home.contextType = AppContext;

export default Home;
