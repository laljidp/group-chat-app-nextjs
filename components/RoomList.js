/* eslint-disable @typescript-eslint/no-empty-function */
import { Box, Button, Grid, Text } from '@chakra-ui/react'

export default function RoomLists({ rooms = [], onRoomClick = () => {} }) {
  return (
    <Grid>
      {rooms.length === 0 && (
        <Text
          color={'#fff'}
          fontWeight={600}
          variant={'solid'}
          borderRadius={'3xl'}
        >
          No rooms available ! 🥺
        </Text>
      )}
      {rooms.map((room) => (
        <Box
          key={room.roomID}
          padding={'8px 15px'}
          bg="facebook.300"
          color={'#fff'}
          fontWeight={500}
          borderRadius={'4px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          marginTop={1}
        >
          <Text>{room.title}</Text>
          <Button
            size="sm"
            colorScheme="telegram"
            onClick={() => onRoomClick(room)}
          >
            Join
          </Button>
        </Box>
      ))}
    </Grid>
  )
}
