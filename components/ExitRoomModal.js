import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { UContext } from '../context/userContext'
import { useRouter } from 'next/router'

export default function DeleteRoomModel({ isOpen, onClose }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const { user } = useContext(UContext)
  const router = useRouter()

  const handleExitRoom = () => {
    router.push('/')
  }

  const handleClose = () => {
    setSubmitting(false)
    onClose()
  }

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Exit Room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box fontWeight="600" mb="1rem">
            You are about to exit this room{' '}
            <Text color={'red.400'}>{user?.title}</Text> & Are you sure?
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            rounded={'full'}
            size="sm"
            colorScheme="teal"
            mr={3}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            isLoading={isSubmitting}
            rounded={'full'}
            onClick={handleExitRoom}
            colorScheme="red"
            size="sm"
          >
            Yes, exit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
