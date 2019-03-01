import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from 'draft-js';
import { Hover } from 'react-powerplug';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import { Box, Flex, Type } from 'blockstack-ui';
import LocationIcon from 'mdi-react/LocationIcon';
import ImageIcon from 'mdi-react/ImageOutlineIcon';
import ImageAddIcon from 'mdi-react/ImageAddIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { Gif } from 'styled-icons/material/Gif';
import { useConnect } from 'redux-bundler-hook';
import NProgress from 'nprogress';
import { rgba } from 'polished';
import StylesWrapper from './styled';
import Message from '../../models/Message';
import { Button } from '../button';
import { useOnClickOutside } from '../../common/hooks';
import { theme } from '../../common/theme';
import { Provider, Tooltip } from 'reakit';
import reakitTheme from 'reakit-theme-default';

const mentionPlugin = createMentionPlugin({
  mentionPrefix: '@',
});
const emojiPlugin = createEmojiPlugin();
const { MentionSuggestions } = mentionPlugin;
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;
const plugins = [mentionPlugin, emojiPlugin];

let allUsernames = [];

const IconButton = ({ tooltip, icons, icon, ...rest }) => (
  <Provider theme={reakitTheme}>
    <Hover>
      {({ hovered, bind }) => {
        const Icon = icons && icons.length ? (hovered ? icons[1] : icons[0]) : icon;
        return (
          <Box
            p={2}
            position="relative"
            cursor={hovered ? 'pointer' : 'unset'}
            color="purple"
            border="1px solid"
            borderRadius="100%"
            boxShadow={hovered ? 'card' : 'none'}
            borderColor={hovered ? 'hsl(204,25%,85%)' : 'hsl(204,25%,90%)'}
            transition="0.1s all ease-in-out"
            {...bind}
            {...rest}
          >
            <Icon style={{ display: 'block' }} size={20} />
            {tooltip ? (
              <Tooltip fade slide visible={hovered}>
                <Tooltip.Arrow />
                <Type fontSize={0}>{tooltip}</Type>
              </Tooltip>
            ) : null}
          </Box>
        );
      }}
    </Hover>
  </Provider>
);

const ImageButton = ({ ...rest }) => <IconButton icons={[ImageIcon, ImageAddIcon]} tooltip="Add an Image" {...rest} />;
const GifButton = ({ ...rest }) => <IconButton icon={Gif} tooltip="Add a GIF" {...rest} />;
const LocationButton = ({ ...rest }) => <IconButton icon={LocationIcon} tooltip="Add a Location" {...rest} />;

const EmojiButton = () => (
  <Hover>
    {({ hovered, bind }) => (
      <Box opacity={hovered ? 1 : 0.5} {...bind}>
        <EmojiSelect />
      </Box>
    )}
  </Hover>
);

const BottomTray = ({ setHasImage, loading, disabled, handleSubmit, ...rest }) => (
  <Flex alignItems="center" pt={2}>
    <Flex {...rest}>
      <ImageButton onClick={() => setHasImage((s) => !s)} />
      <GifButton ml={2} />
      <LocationButton ml={2} />
    </Flex>
    <Box mr="auto" />
    <Button disabled={loading || disabled} ml={2} onClick={handleSubmit}>
      Post{loading ? 'ing...' : ''}
    </Button>
  </Flex>
);

const Compose = ({ pluginProps, ...rest }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [focused, setFocused] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasImage, setHasImage] = useState(false);
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
  const editorWrapper = useRef(null);

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

  const { user } = useConnect('selectUser');

  const currentContent = editorState.getCurrentContent().getPlainText();

  // const hasContent = currentContent !== '';
  const hasContent = true;
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
      <Flex justifyContent="space-between">
        <Box position="relative" is="form" flexGrow={1} onSubmit={handleSubmit}>
          <div style={{ width: '100%', flexGrow: 1 }} ref={editorWrapper}>
            <StylesWrapper>
              <Box
                p={3}
                position="relative"
                zIndex={99}
                border="1px solid"
                borderColor={focused ? 'pink' : 'hsl(204,25%,90%)'}
                boxShadow={focused ? `${rgba(theme.colors.pink, 0.14)} 0px 0px 0px 4px` : 'none'}
                transition="0.1s all ease-in-out"
                onClick={focus}
              >
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
          </div>
          {hasImage ? (
            <Box p={3} border="1px solid" borderTop="0" borderColor={'hsl(204,25%,90%)'} bg="hsl(204,25%,97%)">
              <Box borderRadius="3px" bg="purple" size={100} position="relative">
                <Flex
                  ml="auto"
                  color="white"
                  size={28}
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="card"
                  onClick={() => setHasImage((s) => !s)}
                >
                  <CloseIcon size={20} />
                </Flex>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Flex>
      {focused || hasContent ? (
        <BottomTray setHasImage={setHasImage} disabled={disabled} handleSubmit={handleSubmit} loading={loading} />
      ) : null}
    </Box>
  );
};

export default Compose;
