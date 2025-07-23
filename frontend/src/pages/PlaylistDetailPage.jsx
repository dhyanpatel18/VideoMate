import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Text, Button, SimpleGrid, Card, CardBody, Avatar, Spinner, Alert, AlertIcon, Flex } from '@chakra-ui/react';

const API_BASE = 'http://localhost:3000/api/v1';

const PlaylistDetailPage = () => {
  const { playlistId } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/playlists/${playlistId}`)
      .then(res => setPlaylist(res.data.data))
      .catch(() => setError('Failed to fetch playlist'))
      .finally(() => setLoading(false));
  }, [playlistId]);

  if (loading) return <Spinner size="xl" color="red.500" />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;
  if (!playlist) return <Box>Playlist not found</Box>;

  const isOwner = user && playlist.owner && String(user._id) === String(playlist.owner._id);

  return (
    <Box maxW="900px" mx="auto" w="full">
      <Heading size="lg" mb={2}>{playlist.name}</Heading>
      <Text color="gray.600" mb={4}>{playlist.description}</Text>
      <Flex align="center" gap={3} mb={6}>
        <Avatar name={playlist.owner?.username} size="sm" />
        <Text fontWeight="bold">{playlist.owner?.username || 'Unknown'}</Text>
      </Flex>
      <Heading size="md" mb={2}>Videos</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
        {playlist.videos.map(video => (
          <Card key={video._id}>
            <CardBody>
              <Heading size="sm">{video.title}</Heading>
              <Text color="gray.500">{video.description}</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
      {isOwner && <Button colorScheme="red" mt={6} isDisabled>Add/Remove video (coming soon)</Button>}
    </Box>
  );
};

export default PlaylistDetailPage; 