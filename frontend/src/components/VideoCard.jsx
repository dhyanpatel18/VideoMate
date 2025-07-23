import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Image, Text, HStack, Avatar, useColorModeValue } from '@chakra-ui/react';

const VideoCard = ({ video }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  return (
    <Box
      as={Link}
      to={`/videos/${video._id}`}
      bg={cardBg}
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-2px) scale(1.03)' }}
      transition="all 0.2s"
      display="flex"
      flexDirection="column"
      textDecoration="none"
      color="inherit"
    >
      <Box w="100%" aspectRatio={16 / 9} bg="gray.200" overflow="hidden">
        <Image src={video.thumbnail} alt={video.title} w="100%" h="100%" objectFit="cover" />
      </Box>
      <Box p={4} flex={1} display="flex" flexDirection="column" gap={2}>
        <Text fontWeight="bold" fontSize="lg" noOfLines={2}>{video.title}</Text>
        <HStack spacing={2} fontSize="sm" color="gray.600">
          <Avatar name={video.owner?.username} size="xs" />
          <Text>{video.owner?.username || 'Unknown'}</Text>
          <Text ml="auto">{video.views} views</Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default VideoCard; 