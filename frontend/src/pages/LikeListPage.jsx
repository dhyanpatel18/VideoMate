import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Box, Heading, SimpleGrid, Card, CardBody, Image, Text, Spinner, Alert, AlertIcon, Flex, Avatar } from '@chakra-ui/react';

const API_BASE = 'http://localhost:3000/api/v1';

const LikeListPage = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    axios.get(`${API_BASE}/likes/videos`, { withCredentials: true })
      .then(res => setVideos(res.data.data))
      .catch(() => setError('Failed to fetch liked videos'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Box p={8}><Heading size="md">Please log in to view your liked videos.</Heading></Box>;

  return (
    <Box maxW="1200px" mx="auto" w="full">
      <Heading size="lg" mb={6}>Liked Videos</Heading>
      {loading && <Spinner size="xl" color="red.500" />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
        {videos.map(video => (
          <Card as={Link} to={`/videos/${video._id}`} key={video._id} _hover={{ boxShadow: 'lg', textDecoration: 'none' }}>
            <Image src={video.thumbnail} alt={video.title} borderTopRadius="md" />
            <CardBody>
              <Text fontWeight="bold" fontSize="lg" noOfLines={2}>{video.title}</Text>
              <Flex align="center" gap={2} mt={2}>
                <Avatar name={video.owner?.username} size="xs" />
                <Text fontSize="sm">{video.owner?.username || 'Unknown'}</Text>
                <Text fontSize="sm" ml="auto">{video.views} views</Text>
              </Flex>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default LikeListPage; 