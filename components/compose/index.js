import React, { useContext, useRef, useEffect, useState } from 'react';
import { EditorState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import { Box, Flex } from 'blockstack-ui';
import NProgress from 'nprogress';
import StylesWrapper from './styled';
import Message from '../../models/Message';
import { AppContext } from '../../common/context/app-context';
import { Button } from '../button';
import { useOnClickOutside } from '../../common/hooks';
import { theme } from '../../common/theme';
import { rgba } from 'polished';

const mentionPlugin = createMentionPlugin({
  mentionPrefix: '@',
});
const emojiPlugin = createEmojiPlugin();
const { MentionSuggestions } = mentionPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [mentionPlugin, emojiPlugin];

const Compose = ({ pluginProps, ...rest }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const fetchUsernames = async () => {
    const response = await fetch('/api/usernames');
    const usernames = await response.json();
    const _suggestions = usernames.map((username) => ({
      name: username,
      link: `/[::]${username}`,
      avatar: `/api/avatar/${username}`,
    }));
    setSuggestions(_suggestions);
  };

  useEffect(() => {
    fetchUsernames();
  }, []);

  const editor = useRef(null);
  const editorWrapper = useRef(null);

  const onChange = (state) => {
    setEditorState(state);
  };

  const onSearchChange = ({ value }) => {
    setSuggestions(defaultSuggestionsFilter(value, suggestions));
  };

  const onAddMention = () => {
    // get the mention object selected
  };

  const focus = () => {
    setFocused(true);
    editor.current.focus();
  };

  const { user } = useContext(AppContext);

  const currentContent = editorState.getCurrentContent().getPlainText();

  const disabled = !user || currentContent === '';

  useOnClickOutside(editorWrapper, () => setFocused(false));

  const handleSubmit = async (e) => {
    const content = editorState.getCurrentContent().getPlainText();
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
      createdBy: user._id,
    });
    try {
      await message.save();
      setEditorState(EditorState.createEmpty());
      NProgress.done();
      setLoading(false);
    } catch (error) {
      console.log(error);
      NProgress.done();
      setLoading(false);
    }
    return true;
  };

  return (
    <Box p={4} {...rest}>
      <Flex justifyContent="space-between">
        <Box
          position="relative"
          p={3}
          border="1px solid"
          borderColor={focused ? 'pink' : 'hsl(204,25%,80%)'}
          boxShadow={focused ? `${rgba(theme.colors.pink, 0.14)} 0px 0px 0px 4px` : 'none'}
          transition="0.1s all ease-in-out"
          is="form"
          flexGrow={1}
          onSubmit={handleSubmit}
        >
          <StylesWrapper>
            <Box>
              <div
                className="editor" // eslint-disable-line
                onClick={focus}
                ref={editorWrapper}
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
              <EmojiSelect />
            </Flex>
          </StylesWrapper>
        </Box>
      </Flex>
      {focused && (
        <Flex pt={2}>
          <Box mr="auto" />
          <Button disabled={loading || disabled} ml={2} onClick={handleSubmit}>
            Post{loading ? 'ing...' : ''}
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default Compose;
