import React from 'react';
import TwitterIcon from 'mdi-react/TwitterIcon';
import GithubCircleIcon from 'mdi-react/GithubCircleIcon';
import { Type, Flex } from 'blockstack-ui';
import { Hover } from 'react-powerplug';

const AccountLink = ({ href, children }) => (
  <Hover>
    {({ hovered, bind }) => (
      <Type
        is="a"
        mr={2}
        color={hovered ? 'pink' : 'purple'}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...bind}
      >
        {children}
      </Type>
    )}
  </Hover>
);

const SocialAccounts = ({ profile }) => {
  const accounts = {};
  const accountsExist = profile &&
    profile.account &&
    profile.account.length;
  if (accountsExist) {
    profile.account.forEach((account) => {
      accounts[account.service] = account;
    });
  }

  return (
    <Flex mx="auto" alignItems="center" justifyContent="center">
      {accounts.github && (
        <AccountLink href={`https://github.com/${accounts.github.identifier}`}>
          <GithubCircleIcon />
        </AccountLink>
      )}
      {accounts.twitter && (
        <AccountLink href={`https://twitter.com/${accounts.twitter.identifier}`}>
          <TwitterIcon />
        </AccountLink>
      )}
    </Flex>
  );
};

export default SocialAccounts;
