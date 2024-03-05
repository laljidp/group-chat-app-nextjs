import {
  Container,
  Flex,
  Input,
  Button,
  Grid,
  Box,
  Text,
} from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import AnimLogo from '../../components/AnimLogo'
import { createRoom } from '../../server/rooms.fb'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { UContext } from '../../context/userContext'
import RoomLists from '../../components/RoomList'

export default function Home() {
  const [isSubmitting, setSubmitting] = useState(false)
  const [existingRooms, setExistingRooms] = useState([])
  const { setUserInfo, addRoom, getLocalRooms } = useContext(UContext)

  const router = useRouter()

  const handleStartChannel = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const title = formData.get('title')
    const userName = formData.get('name')
    setSubmitting(true)
    const response = await createRoom({
      title,
      userName,
      participants: [],
      joined: [],
      createdAt: new Date(),
    })
    const payload = {
      userName,
      title,
      isAdmin: true,
      roomID: response.documentID,
    }
    if (response.success) {
      console.log('Document created successfully!')
      setUserInfo(payload)
      addRoom(payload)
      router.push(`/chat-room/${response.documentID}`)
    }
    setSubmitting(false)
  }

  const handleRoomJoin = (room) => {
    setUserInfo(room)
    router.push(`/chat-room/${room.roomID}`)
  }

  useEffect(() => {
    const rooms = getLocalRooms()
    setExistingRooms(rooms)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxW="container.sm">
      <Flex justifyContent={'center'} alignItems="center" height={'40vh'}>
        <Grid justifyContent={'center'} alignItems="normal">
          <Flex alignItems="center" justifyContent="center" borderRadius="10">
            <AnimLogo />
          </Flex>
          <form onSubmit={handleStartChannel}>
            <Input
              mt={5}
              placeholder="Enter chitchat title"
              size="lg"
              name="title"
              required
              color={'purple'}
              minLength={3}
              fontWeight="500"
            />
            <Input
              mt={5}
              placeholder="Enter your name"
              size="lg"
              name="name"
              color={'purple'}
              minLength={3}
              required
              fontWeight="500"
            />
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="purple"
              size={'md'}
              mt="5"
              type="submit"
              isLoading={isSubmitting}
            >
              START A ROOM
            </Button>
          </form>
        </Grid>
      </Flex>
      <Box>
        <Text marginBottom={2} as={'h2'} fontWeight={500}>
          Recently Joined rooms :
        </Text>
        <RoomLists rooms={existingRooms} onRoomClick={handleRoomJoin} />
      </Box>
    </Container>
  )
}
