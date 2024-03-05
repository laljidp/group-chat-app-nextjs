import React from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { UContext } from '../context/userContext'
import { updateInvittes } from '../server/rooms.fb'
import { isValidPhoneNumber } from '../utils'
import { getMessageString, sendSMS } from '../server/fastSMS'
import CopyLinkButton from './CopyLinkButton'

export default function InviteUserModal({ isOpen, onClose, invitee = [] }) {
  const [isSubmitting, setSubmitting] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const { user } = useContext(UContext)
  const toast = useToast()

  const getJoiningLink = () => {
    return `${window?.location?.origin}/join-room/${user?.roomID}`
  }

  const inviteUserRequest = async () => {
    setSubmitting(true)

    if (!isValidPhoneNumber(phoneNumber)) {
      toast({
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }
    //send link via sms
    const url = getJoiningLink()
    const message = getMessageString(url, user?.title)
    const result = await sendSMS(phoneNumber, message)
    if (result.success) {
      toast({
        title: 'Invite',
        description: `Invite sent to +91 ${phoneNumber}`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      // update invitee to the firebase collection
      await updateInvittes(user?.roomID, {
        number: phoneNumber,
        createdAt: new Date(),
      })
      handleClose()
    }
    setSubmitting(false)
  }

  const handleClose = () => {
    setSubmitting(false)
    setPhoneNumber('')
    onClose()
  }

  const notAllowToSendSMS = invitee.length >= 10

  return (
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite via Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {notAllowToSendSMS ? (
            <>
              <Alert status="warning">
                <AlertIcon />
                <AlertDescription fontWeight={500}>
                  {`You've exceeded SMS sending limits for the room. You can send
                  a link by copying it.`}
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <>
              <InputGroup visibility={'hidden'}>
                <InputLeftAddon>+91</InputLeftAddon>
                <Input
                  type="tel"
                  placeholder="Phone number"
                  onChange={({ target }) => setPhoneNumber(target.value)}
                />
              </InputGroup>
              <Box
                display={'flex'}
                justifyContent={'flex-end'}
                alignItems={'center'}
                marginTop={5}
              >
                <Box display={'flex'} justifyContent={'center'} marginRight={2}>
                  <CopyLinkButton link={getJoiningLink()} />
                </Box>
                <Button
                  visibility={'hidden'}
                  isLoading={isSubmitting}
                  rounded={'full'}
                  onClick={inviteUserRequest}
                  colorScheme="telegram"
                  size="sm"
                >
                  Send Link
                </Button>
              </Box>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
