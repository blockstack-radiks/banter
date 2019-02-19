import React from 'react';
import {
  Flex, Box,
} from 'rebass';
import PropTypes from 'prop-types';

import Message from '../models/Message';
import Feed from '../components/feed';

class Home extends React.Component {
  static propTypes = {
    messages: PropTypes.array.isRequired,
  }

  static async getInitialProps() {
    const messages = await Message.fetchList({
      sort: '-createdAt',
      limit: 10,
    }, { decrypt: false });
    return {
      messages,
    };
  }

  render() {
    return (
      <>
        <Flex>
          <Box width={[1, 3 / 4]} mx="auto">
            <Feed messages={this.props.messages} />
          </Box>
        </Flex>
      </>
    );
  }
}

export default Home;
