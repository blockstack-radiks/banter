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

  const maxLength = 240;

  const fetchUsernames = async () => {
    const response = await fetch('/api/usernames');
    const usernames = await response.json();
    allUsernames = usernames.map((username) => ({
      name: username,
      link: `/[::]${username}`,
      avatar: `/api/avatar/${username}`,
    }));
    setSuggestions(allUsernames);
  };

  useEffect(() => {
    fetchUsernames();
  }, []);

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

  return (
    <Box p={4} {...rest}>
      <div style={{ width: '100%', flexGrow: 1 }} ref={editorWrapper}>
        <Flex justifyContent="space-between">
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
                    placeholder="What's on your mind?"
                    editorState={editorState}
                    onChange={onChange}
                    plugins={plugins}
                    ref={editor}
                  />
                  <MentionSuggestions
                    onSearchChange={onSearchChange}
                    suggestions={suggestions}
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
