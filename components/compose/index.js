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

const mentionPlugin = createMentionPlugin({
  mentionPrefix: '@',
});
const emojiPlugin = createEmojiPlugin();
const { MentionSuggestions } = mentionPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [mentionPlugin, emojiPlugin];


let allUsernames = [];

const Compose = ({ pluginProps, ...rest }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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

  const onChange = (state) => {
    setEditorState(state);
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

  const { user } = useContext(AppContext);

  const disabled = !user;

  const handleSubmit = async (e) => {
    const content = editorState.getCurrentContent().getPlainText();
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (content === '') {
      return null;
    }
    NProgress.start();
    const message = new Message({
      content,
      createdBy: user._id,
    });
    try {
      await message.save();
      setEditorState(EditorState.createEmpty());
      NProgress.done();
    } catch (error) {
      console.log(error);
      NProgress.done();
    }
    return true;
  };

  return (
    <Box p={4} {...rest}>
      <Flex justifyContent="space-between">
        <Box
          position="relative"
          p={3}
          border="1px solid hsl(204,25%,80%)"
          is="form"
          flexGrow={1}
          onSubmit={handleSubmit}
        >
          <StylesWrapper>
            <Box>
              <div className="editor" // eslint-disable-line
                onClick={focus}
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
          <Button disabled={disabled} ml={2} onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default Compose;
