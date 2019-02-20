import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../common/context/app-context'
import { Flex, Box, Type } from 'blockstack-ui'
import NProgress from 'nprogress'
import { getConfig } from 'radiks'
import Input from '../styled/input'
import Message from '../models/Message'
import MessageComponent from './message'
import { Button } from './button'
import { Login } from './login'

const Compose = ({ handleSubmit, value, handleValueChange, disabled, ...rest }) => (
  <Box p={4} {...rest}>
    <Flex justifyContent="space-between">
      <Box is="form" flexGrow={1} onSubmit={handleSubmit}>
        <Input
          type="text"
          width={1}
          placeholder="What do you have to say?"
          value={value}
          onChange={(evt) => handleValueChange(evt.target.value)}
        />
      </Box>
      <Button disabled={disabled} ml={2} onClick={handleSubmit}>
        Submit
      </Button>
    </Flex>
  </Box>
)

const login = () => {
  const scopes = ['store_write', 'publish_data']
  const redirect = window.location.origin
  const manifest = `${window.location.origin}/manifest.json`
  const { userSession } = getConfig()
  userSession.redirectToSignIn(redirect, manifest, scopes)
}

const fetchMoreMessages = async (messages) => {
  const lastMessage = messages && messages.length && messages[messages.length - 1]
  const newMessages = await Message.fetchList(
    {
      createdAt: {
        $lt: lastMessage && lastMessage.attrs.createdAt
      },
      limit: 10,
      sort: '-createdAt'
    },
    { decrypt: false }
  )
  const newmessages = messages && messages.concat(newMessages)
  const hasMoreMessages = newMessages.length !== 0
  return {
    hasMoreMessages,
    messages: newmessages
  }
}

const TopArea = (props) => {
  const { isLoggedIn, user, isSigningIn } = useContext(AppContext)
  const [content, setContent] = useState('')

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    if (content === '') {
      return null
    }
    NProgress.start()
    const message = new Message({
      content,
      createdBy: user._id
    })
    try {
      await message.save()
      setContent('')
      NProgress.done()
    } catch (e) {
      console.log(e)
      NProgress.done()
    }
  }

  return !isLoggedIn ? (
    <Login px={4} handleLogin={login} />
  ) : (
    <Compose
      handleSubmit={handleSubmit}
      handleValueChange={setContent}
      value={content}
      disabled={content === '' || !user}
    />
  )
}

const Messages = ({ messages }) => messages.map((message) => <MessageComponent key={message._id} message={message} />)

const Feed = ({ messages, rawMessages, ...rest }) => {
  const [liveMessages, setLiveMessages] = useState(rawMessages.map((m) => new Message(m.attrs)))
  const [loading, setLoading] = useState(false)
  const [viewingAll, setViewingAll] = useState(false)

  const newMessageListener = (message) => {
    if (liveMessages.find((m) => m._id === message._id)) {
      return null
    }
    setLiveMessages([...new Set([message, ...liveMessages])])
  }

  const subscribe = () => Message.addStreamListener(newMessageListener)
  const unsubscribe = () => Message.removeStreamListener(newMessageListener)

  useEffect(() => {
    subscribe()
    return unsubscribe
  })

  const loadMoreMessages = () => {
    NProgress.start()
    setLoading(true)
    fetchMoreMessages(liveMessages).then(({ hasMoreMessages, messages }) => {
      if (hasMoreMessages) {
        setLiveMessages(messages)
        setLoading(false)
        NProgress.done()
      } else {
        NProgress.done()
        setLoading(false)
        setViewingAll(true)
      }
    })
  }

  return (
    <Box
      border="1px solid rgb(230, 236, 240)"
      my={4}
      mx="auto"
      maxWidth={600}
      bg="white"
      borderRadius={2}
      boxShadow="card"
      {...rest}
    >
      <TopArea />
      <Messages messages={liveMessages} />
      <Flex borderTop="1px solid rgb(230, 236, 240)" alignItems="center" justifyContent="center" p={4}>
        {viewingAll ? (
          <Type color="purple" fontWeight="bold">
            You've reached the end of the line!
          </Type>
        ) : (
          <Button onClick={!loading && loadMoreMessages}>{loading ? 'Loading...' : 'Load more'}</Button>
        )}
      </Flex>
    </Box>
  )
}

export default Feed
