import React from 'react'
import { Container, Text } from '@chakra-ui/react'
import Message from './Message'

function ChatBody({ data: messages }) {
  return (
    <Container maxW={'container'} padding={'10px 5px'}>
      {messages.length === 0 && (
        <Text
          textAlign={'center'}
          bg={'facebook.300'}
          padding={2}
          color={'white'}
          borderRadius={'2xl'}
        >
          No chit chat yet. you can start by sending a message.
        </Text>
      )}
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </Container>
  )
}

const MemoizedChatBody = React.memo(ChatBody)

export default MemoizedChatBody
