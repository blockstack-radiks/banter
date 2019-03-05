import React, { useRef, useEffect, useState } from 'react';
import { EditorState, ContentState } from 'draft-js';
import { Hover } from 'react-powerplug';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import { Box, Flex } from 'blockstack-ui';
import { useConnect } from 'redux-bundler-hook';
import NProgress from 'nprogress';
import { rgba } from 'polished';
import StylesWrapper from './styled';
import Message from '../../models/Message';
import { Button } from '../button';
import { useOnClickOutside } from '../../common/hooks';
import { theme } from '../../common/theme';
import InviteUserModal from '../modal/invite-user';
import { generateImageUrl } from '../../common/utils';

const mentionPlugin = createMentionPlugin({
  mentionPrefix: '@',
});
const emojiPlugin = createEmojiPlugin();
const { MentionSuggestions } = mentionPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [mentionPlugin, emojiPlugin];

let allUsernames = [];

const EmojiButton = () => (
  <Hover>
    {({ hovered, bind }) => (
      <Box opacity={hovered ? 1 : 0.5} {...bind}>
        <EmojiSelect />
      </Box>
    )}
  </Hover>
);

const Compose = ({ pluginProps, ...rest }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');
  const [blockstackProfiles, setBlockstackProfiles] = useState([]);

  const maxLength = 240;

  const fetchUsernames = async () => {
    const response = await fetch('/api/usernames');
    const usernames = await response.json();
    allUsernames = usernames.map((username) => ({
      id: username,
      name: username,
      link: `/[::]${username}`,
      avatar: generateImageUrl(username, 80),
    }));
    setSuggestions(allUsernames);
  };

  useEffect(() => {
    fetchUsernames();
  }, []);

  const fetchBlockstackAccounts = async () => {
    const url = `https://core.blockstack.org/v1/search?query=${query}`;
    const response = await fetch(url);
    const { results } = await response.json();
    if (!results) return;
    setBlockstackProfiles(results.map((user) => ({
      id: user.fullyQualifiedName,
      name: user.fullyQualifiedName,
      link: `/[::]${user.fullyQualifiedName}`,
      avatar: generateImageUrl(user.fullyQualifiedName, 80),
    })));
  };

  useEffect(() => {
    setBlockstackProfiles([]);
    fetchBlockstackAccounts();
  }, [query]);

  const editor = useRef(null);
  const editorWrapper = useRef(null);

  const currentContent = editorState.getCurrentContent().getPlainText('');
  const currentContentCount = editorState.getCurrentContent().getPlainText('').length;

  const onChange = (state) => {
    const newContentText = state.getCurrentContent().getPlainText('');
    const newContentTextCount = newContentText.length;
    const newContentIsTooLong = newContentTextCount > maxLength;
    if (newContentIsTooLong) {
      const truncatedTextContent = newContentText.substring(0, maxLength);
      const truncatedEditorState = EditorState.createWithContent(ContentState.createFromText(truncatedTextContent));
      setEditorState(truncatedEditorState);
    } else {
      setEditorState(state);
    }
  };

  const onSearchChange = ({ value }) => {
    setQuery(value);
    setSuggestions(defaultSuggestionsFilter(value, allUsernames));
  };

  const onAddMention = () => {
    // get the mention object selected
  };

  const focus = () => {
    setFocused(true);
    editor.current.focus();
  };

  const { user } = useConnect('selectUser');

  const disabled = !user || currentContent === '';

  useOnClickOutside(editorWrapper, () => setFocused(false));

  const handleSubmit = async (e) => {
    const content = editorState.getCurrentContent().getPlainText('');
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (content === '') {
      return null;
    }
    NProgress.start();
    setLoading(true);
    const message = new Message({
      content,
      votes: [],
      createdBy: user._id,
    });
    try {
      await message.save();
      setEditorState(EditorState.createEmpty());
      NProgress.done();
      setLoading(false);
      setFocused(false);
    } catch (error) {
      console.log(error);
      NProgress.done();
      setLoading(false);
      setFocused(false);
    }
    return true;
  };

  const getUniqueSuggestions = () => {
    const flags = {};
    let allSuggestions = suggestions.concat(blockstackProfiles);
    allSuggestions = allSuggestions.filter((suggestion) => {
      if (flags[suggestion.name]) {
        return false;
      }
      flags[suggestion.name] = true;
      return true;
    });
    return allSuggestions;
  };

  return (
    <Box p={4} {...rest}>
      <div style={{ width: '100%', flexGrow: 1 }} ref={editorWrapper}>
        <Flex justifyContent="space-between">
          <InviteUserModal />
          <Box
            position="relative"
            p={3}
            border="1px solid"
            borderColor={focused ? 'pink' : 'hsl(204,25%,90%)'}
            boxShadow={focused ? `${rgba(theme.colors.pink, 0.14)} 0px 0px 0px 4px` : 'none'}
            transition="0.1s all ease-in-out"
            is="form"
            flexGrow={1}
            onSubmit={handleSubmit}
            onClick={focus}
          >
            <StylesWrapper>
              <Box>
                <div
                  className="editor" // eslint-disable-line
                >
                  <Editor
                    placeholder="Whats on your mind? Invite friends with an @mention!"
                    editorState={editorState}
                    onChange={onChange}
                    plugins={plugins}
                    ref={editor}
                  />
                  <MentionSuggestions
                    onSearchChange={onSearchChange}
                    suggestions={getUniqueSuggestions()}
                    onAddMention={onAddMention}
                  />
                  <EmojiSuggestions />
                </div>
              </Box>
              <Flex position="absolute" top="2px" right="8px">
                <EmojiButton />
              </Flex>
            </StylesWrapper>
          </Box>
        </Flex>
        {focused && (
          <Flex pt={2} alignItems="center">
            <Box mr="auto" />
            {currentContentCount >= maxLength * 0.9 ? (
              <Box
                color={currentContentCount === maxLength ? 'red' : 'purple'}
                opacity={currentContentCount === maxLength ? 1 : 0.5}
                fontWeight={currentContentCount === maxLength ? 'bold' : '500'}
                fontSize={1}
              >
                {currentContentCount}/240
              </Box>
            ) : null}
            <Button disabled={loading || disabled} ml={2} onClick={handleSubmit}>
              Post{loading ? 'ing...' : ''}
            </Button>
          </Flex>
        )}
      </div>
    </Box>
  );
};

export default Compose;
