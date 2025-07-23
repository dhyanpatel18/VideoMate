import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Button, SimpleGrid, Spinner, Alert, AlertIcon, Card, CardBody, Text, Flex } from '@chakra-ui/react';

const API_BASE = 'http://localhost:3000/api/v1';

const PlaylistListPage = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    axios.get(`${API_BASE}/playlists/user/${user._id}`)
      .then(res => setPlaylists(res.data.data))
      .catch(() => setError('Failed to fetch playlists'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Box p={8}><Heading size="md">Please log in to view your playlists.</Heading></Box>;

  return (
    <Box maxW="1000px" mx="auto" w="full">
      <Flex align="center" justify="space-between" mb={6}>
        <Heading size="lg">Your Playlists</Heading>
        <Button colorScheme="red" onClick={() => navigate('/playlists/new')}>Create Playlist</Button>
      </Flex>
      {loading && <Spinner size="xl" color="red.500" />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
        {playlists.map(playlist => (
          <Card as={Link} to={`/playlists/${playlist._id}`} key={playlist._id} _hover={{ boxShadow: 'lg', textDecoration: 'none' }}>
            <CardBody>
              <Heading size="md" mb={2}>{playlist.name}</Heading>
              <Text color="gray.600">{playlist.description}</Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlaylistListPage; 