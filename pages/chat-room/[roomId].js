import { useContext, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import PageLoader from '../../components/PageLoader'
import useLoading from '../../hooks/useLoading'
import ChatHeader from '../../components/ChatHeader'
import ChatFooter from '../../components/ChatFooter'
import ChatBody from '../../components/ChatBody'
import InvalidRequest from '../../components/InvalidRequest'
import { getRoomInfo, getRoomRef } from '../../server/rooms.fb'
import { Box, useDisclosure, useToast } from '@chakra-ui/react'
import { UContext } from '../../context/userContext'
import { getChatsByGroupQuery, saveMessage } from '../../server/message.db'
import { onSnapshot } from 'firebase/firestore'
import ExitRoomModal from '../../components/ExitRoomModal'

const InviteUserModal = dynamic(
  () => import('../../components/InviteUserModal'),
  { ssr: false }
)

export async function getServerSideProps(context) {
  const roomID = context.params.roomId
  const response = await getRoomInfo(roomID)
  return {
    props: {
      roomInfo: response?.data || {},
    },
  }
}

export default function ChatRoom({ roomInfo }) {
  const isLoading = useLoading()
  const { user, userLoading } = useContext(UContext)
  const [room, setRoom] = useState(roomInfo)
  const toast = useToast()
  const [chats, setChats] = useState([])
  const [message, setMessage] = useState({
    text: '',
    attachments: [],
  })
  const chatBodyRef = useRef(null)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isInviteModalOpen,
    onOpen: onInviteModalOpen,
    onClose: onInviteModalClose,
  } = useDisclosure()

  const handleChange = (data) => {
    setMessage({ ...message, ...data })
  }

  const handleRemoveImage = (src) => {
    const newAttachmentArr = message.attachments.slice()
    newAttachmentArr.splice(newAttachmentArr.indexOf(src), 1)
    setMessage({ ...message, attachments: newAttachmentArr })
  }

  const handleSaveMessage = async () => {
    if (!message?.text?.trim() && message.attachments.length === 0) {
      toast({
        title: 'Message and attachments are empty! Required one of them',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    // call Firebase API to save the message
    const payload = {
      ...message,
      sender: user?.userName,
      roomID: room.id,
      createdAt: new Date(),
      status: '',
    }
    setMessage({
      text: '',
      attachments: [],
    })
    const result = await saveMessage(payload)
    if (!result.success) {
      toast({
        title: 'Message failed to send!',
        position: 'top',
        status: 'error',
      })
    }
  }

  useEffect(() => {
    let unsubscribeChats
    let unsubscribeRoomInfo

    if (room?.id) {
      unsubscribeChats = onSnapshot(
        getChatsByGroupQuery(room?.id),
        (querySnapshot) => {
          const data = []
          querySnapshot.forEach((doc) => {
            data.push(doc.data())
          })
          setChats(data)
          setTimeout(() => {
            chatBodyRef?.current?.scrollTo({
              top: chatBodyRef.current.scrollHeight,
              behavior: 'smooth',
            })
          }, 300)
        }
      )
      unsubscribeRoomInfo = onSnapshot(getRoomRef(room?.id), (roomSnap) => {
        setRoom(roomSnap.data())
      })
    }

    return () => {
      unsubscribeChats && unsubscribeChats()
      unsubscribeRoomInfo && unsubscribeRoomInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if ((!room?.id || !user?.userName) && !userLoading) {
    return <InvalidRequest errorText="Room does not exists!" />
  }

  return (
    <Box>
      {isLoading && <PageLoader />}

      {!isLoading && (
        <Box>
          <Box
            padding={4}
            bgGradient="linear(to-r, green.100, pink.300)"
            position={'fixed'}
            width={'100%'}
            zIndex={2}
            top={0}
          >
            <ChatHeader
              title={room.title}
              onDelete={onOpen}
              onInviteClick={onInviteModalOpen}
              joiningLink={`${location.origin}/join-room/${room.id}`}
            />
          </Box>
          <Box
            height={'calc(100vh - 160px)'}
            ref={chatBodyRef}
            overflow={'auto'}
            margin={'64px 0 90px 0'}
            padding={'5px 0'}
          >
            <ChatBody data={chats} />
          </Box>
          <ChatFooter
            text={message.text}
            attachments={message.attachments}
            onSaveMessage={handleSaveMessage}
            handleChange={handleChange}
            handleRemoveImage={handleRemoveImage}
          />
        </Box>
      )}
      <ExitRoomModal
        isOpen={isOpen}
        onClose={onClose}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDelete={() => {}}
        roomTitle={room?.title}
      />
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={onInviteModalClose}
        invitee={room.invitee}
      />
    </Box>
  )
}
