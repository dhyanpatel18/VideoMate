import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';
import { Box, Heading, Button, SimpleGrid, Flex } from '@chakra-ui/react';

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

const VideoListPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/videos`)
      .then(res => setVideos(res.data.data.videos || []))
      .catch(() => setError('Failed to fetch videos'))
      .finally(() => setLoading(false));
  }, []);

  const showVideos = videos.length > 0 ? videos : DEMO_VIDEOS;

  return (
    <Box maxW="1400px" mx="auto" w="full">
      <Flex align="center" justify="space-between" mb={6}>
        <Heading size="lg">All Videos</Heading>
        {user && <Button colorScheme="red" onClick={() => navigate('/videos/upload')}>Upload Video</Button>}
      </Flex>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
        {showVideos.map(video => (
          <VideoCard key={video._id} video={video} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default VideoListPage; 