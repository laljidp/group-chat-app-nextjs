import { Box, Text } from '@chakra-ui/layout'
import ImagesPreview from './ImagesPreview'
import styled from '@emotion/styled'
import { useContext } from 'react'
import { UContext } from '../context/userContext'
import moment from 'moment/moment'

function Message({ message }) {
  const {
    user: { userName = '' },
  } = useContext(UContext)

  const isMe = userName === message.sender

  return (
    <BoxAlign me={isMe}>
      <MessageContainer
        bgColor={isMe ? 'facebook.500' : 'telegram.500'}
        me={isMe}
      >
        <Text as="h5" color="white" fontWeight={500}>
          {isMe ? 'You' : message.sender}&nbsp;
          <small>( {moment(message.createdAt).fromNow()} )</small>
        </Text>
        <hr />
        <ImagesPreview images={message.attachments || []} />
        <Text marginTop={3} fontWeight={500}>
          {message.text}
        </Text>
      </MessageContainer>
    </BoxAlign>
  )
}

const BoxAlign = styled(Box)(
  {
    width: '100%',
    display: 'inline-flex',
    marginTop: '10px',
  },
  (props) =>
    props.me ? { justifyContent: 'end' } : { justifyContent: 'start' }
)

const MessageContainer = styled(Box)(
  {
    fontSize: '.9rem',
    color: 'gray',
    padding: '.5rem',
    maxWidth: '75%',
    width: 'fit-content',
    border: '1px solid teal',
    color: '#fff',
    borderRadius: '10px 25px',
    fontWeight: '600',
    fontFamily: 'Helvetica',
    display: 'grid',
  },
  (props) =>
    props.me ? { borderRadius: '25px 10px' } : { borderRadius: '10px 25px' }
)

export default Message
