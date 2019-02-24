const { COLLECTION } = require('radiks-server/app/lib/constants');

const aggregateMessages = async (radiksData, query) => {
  const match = {
    $match: {
      radiksType: 'Message',
    },
  };
  if (query.lt) {
    match.$match.createdAt = {
      $lt: parseInt(query.lt, 10),
    };
  }
  if (query.gte) {
    match.$match.createdAt = {
      $gte: query.gte,
    };
  }
  if (query.createdBy) {
    match.$match.createdBy = query.createdBy;
  }
  const sort = {
    $sort: { createdAt: -1 },
  };
  const limit = {
    $limit: query.limit || 10,
  };

  const votesLookup = {
    $lookup: {
      from: COLLECTION,
      localField: '_id',
      foreignField: 'messageId',
      as: 'votes',
    },
  };

  const pipeline = [match, sort, limit, votesLookup];

  const messages = await radiksData.aggregate(pipeline).toArray();

  return messages;
};

const transformMessageVotes = (_messages, username) => {
  const messages = [..._messages];
  messages.forEach((message, index) => {
    const _message = {
      ...message,
    };
    _message.hasVoted = false;
    if (username) {
      message.votes.forEach((vote) => {
        if (vote.username === username) {
          _message.hasVoted = true;
        }
      });
    }
    _message.votes = message.votes.length;
    messages[index] = _message;
  });
  return messages;
};

module.exports = {
  aggregateMessages,
  transformMessageVotes,
};
