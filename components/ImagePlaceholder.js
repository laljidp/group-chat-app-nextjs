import { CloseIcon } from '@chakra-ui/icons'
import { Box, Button, Icon, Image } from '@chakra-ui/react'

export default function ImagePlaceholder({ files = [], onRemoveImage }) {
  if (files.length === 0) return null

  return (
    <Box display={'flex'} gap={2} padding={2} borderRadius={'4'}>
      {files.map((src, index) => (
        <Box
          key={src}
          bg="gray.300"
          borderRadius={'4px'}
          padding={1}
          position={'relative'}
        >
          <Image width={75} height={75} src={src} alt="images" key={index} />
          <Button
            size="xs"
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            position={'absolute'}
            top={-3}
            right={-3}
            borderRadius={'full'}
            onClick={() => onRemoveImage(src)}
          >
            <Icon width={2} height={2} as={CloseIcon} />
          </Button>
        </Box>
      ))}
    </Box>
  )
}
