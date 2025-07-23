import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Box, Flex, Heading, Text, Button, Avatar, VStack, HStack, Image, Divider } from '@chakra-ui/react';

const API_BASE = 'http://localhost:3000/api/v1';

const DEMO_VIDEOS = [
  {
    _id: 'demo1',
    title: 'Sample Video 1',
    thumbnail: 'https://images.pexels.com/videos/856107/pexels-photo-856107.jpeg?auto=compress&w=400',
    videoFile: 'https://www.w3schools.com/html/mov_bbb.mp4',
    owner: { username: 'DemoChannel' },
    views: 1234
  },
  {
    _id: 'demo2',
    title: 'Sample Video 2',
    thumbnail: 'https://images.pexels.com/videos/854190/pexels-photo-854190.jpeg?auto=compress&w=400',
    videoFile: 'https://www.w3schools.com/html/movie.mp4',
    owner: { username: 'DemoChannel2' },
    views: 5678
  }
];

const VideoDetailPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/videos/${videoId}`)
      .then(res => setVideo(res.data.data))
      .catch(() => setError('Failed to fetch video'))
      .finally(() => setLoading(false));
    axios.get(`${API_BASE}/videos`)
      .then(res => {
        const vids = res.data.data.videos || [];
        setRelated(vids.filter(v => v._id !== videoId).slice(0, 6));
      })
      .catch(() => setRelated(DEMO_VIDEOS.filter(v => v._id !== videoId)));
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <Box color="red.500">{error}</Box>;
  if (!video) return <Box>Video not found</Box>;

  return (
    <Flex gap={8} maxW="1400px" mx="auto" w="full" direction={{ base: 'column', md: 'row' }}>
      <Box flex={2} minW={0}>
        <Box w="100%" bg="black" borderRadius="lg" overflow="hidden" mb={4}>
          <video src={video.videoFile} controls poster={video.thumbnail} style={{ width: '100%', borderRadius: 8 }} />
        </Box>
        <Heading size="lg" mb={2}>{video.title}</Heading>
        <HStack spacing={4} mb={2} color="gray.600">
          <Avatar name={video.owner?.username} size="sm" />
          <Text fontWeight="bold">{video.owner?.username || 'Unknown'}</Text>
          <Text>{video.views} views</Text>
        </HStack>
        <Text fontSize="md" mb={4}>{video.description}</Text>
        <HStack spacing={4} mb={6}>
          <Button colorScheme="red">Like</Button>
          <Button>Subscribe</Button>
        </HStack>
        <Divider mb={4} />
      </Box>
      <VStack flex={1} align="stretch" spacing={4} minW="220px" maxW="320px">
        <Heading size="md" mb={2}>Related Videos</Heading>
        {(related.length > 0 ? related : DEMO_VIDEOS).map(v => (
          <Flex as={Link} to={`/videos/${v._id}`} key={v._id} align="center" gap={3} bg="white" borderRadius="md" p={2} boxShadow="sm" _hover={{ boxShadow: 'md', textDecoration: 'none' }}>
            <Image src={v.thumbnail} alt={v.title} w="90px" h="54px" objectFit="cover" borderRadius="md" />
            <Box>
              <Text fontWeight="bold" fontSize="md" noOfLines={2}>{v.title}</Text>
              <Text fontSize="sm" color="gray.500">{v.owner?.username || 'Unknown'} • {v.views} views</Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
};

export default VideoDetailPage; 