import React from 'react';
import { Flex, Box } from 'rebass';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Message from '../models/Message';
import Feed from '../components/feed';
import { AppContext } from '../common/context/app-context';

class Home extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
  };

  state = {
    user: null,
  };

  static getInitialProps = async () => {
    const rawMessages = await Message.fetchList(
      {
        sort: '-createdAt',
        limit: 10,
      },
      { decrypt: false }
    );

    return {
      rawMessages,
    };
  };

  render() {
    return (
      <Flex>
        <Head>
          <title>Banter</title>
        </Head>
        <Box width={[1, 3 / 4]} mx="auto">
          <Feed rawMessages={this.props.rawMessages} />
        </Box>
      </Flex>
    );
  }
}

Home.contextType = AppContext;

export default Home;
