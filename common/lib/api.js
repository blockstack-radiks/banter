import qs from 'qs';
import { getConfig } from 'radiks';

/**
 *
 * @param {*} query - Use `lt`, `createdBy`, and `fetcher` to query messages.
 * @param lt - fetch all votes created before the time provided
 * @param createdBy - messages created by this username
 * @param fetcher - pass the current user's username, to get info about if they've voted
 */
export const fetchMessages = async (query) => {

  const { apiServer } = getConfig();
  const url = `${apiServer}/api/messages?${qs.stringify(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.messages;
};

/**
 *
 * @param {*} query - Use `lt`, `createdBy`, and `fetcher` to query messages.
 * @param lt - fetch all votes created before the time provided
 * @param createdBy - messages created by this username
 * @param fetcher - pass the current user's username, to get info about if they've voted
 */
export const fetchVotes = async (query) => {
  const { apiServer } = getConfig();
  const url = `${apiServer}/api/votes?${qs.stringify(query)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.messages;
};

export const fetchUser = async (username) => {
  const { apiServer } = getConfig();
  const url = `${apiServer}/api/user/${username}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const sendInviteEmails = async (data) => {
  const { apiServer } = getConfig();
  const url = `${apiServer}/api/invite`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  const { success } = await response.json();
  return success;
};

export const uploadPhoto = async (gaiaUrl, filename) => {
  const { apiServer } = getConfig();
  const serverUrl = `${apiServer}/api/upload`;
  const response = await fetch(serverUrl, {
    method: 'POST',
    body: JSON.stringify({
      gaiaUrl,
      filename,
    }),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  const { url } = await response.json();
  return url;
};
