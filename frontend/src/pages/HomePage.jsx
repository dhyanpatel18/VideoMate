import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, HStack, Button, SimpleGrid, useColorMode, useColorModeValue, Avatar, Text, IconButton, Input, InputGroup, InputLeftElement, VStack } from '@chakra-ui/react';
import { MoonIcon, SunIcon, SearchIcon, AddIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

const CATEGORIES = [
  'All', 'Music', 'Data Structures', 'JavaScript', 'Gaming', 'Comedy', 'Live', 'Esports', 'Playlists', 'Backend', 'Frontend', 'Trending'
];

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/videos`)
      .then(res => setVideos(res.data.data.videos || []))
      .catch(() => setError('Failed to fetch videos'))
      .finally(() => setLoading(false));
  }, []);

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const sidebarBg = useColorModeValue('white', 'gray.800');

  return (
    <Flex direction="column" minH="100vh" bg={bg}>
      {/* Header */}
      <Flex as="header" align="center" justify="space-between" px={6} py={3} bg={sidebarBg} boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <HStack spacing={4}>
          <Heading size="lg" color="red.400" cursor="pointer" onClick={() => navigate('/')}>VideoMate</Heading>
        </HStack>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input type="text" placeholder="Search..." bg={bg} borderRadius="md" />
        </InputGroup>
        <HStack spacing={3}>
          <IconButton icon={<AddIcon />} aria-label="Upload" colorScheme="red" onClick={() => navigate('/videos/upload')} />
          <IconButton icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />} aria-label="Toggle dark mode" onClick={toggleColorMode} />
          <Avatar size="sm" name="User" />
        </HStack>
      </Flex>
      <Flex flex={1}>
        {/* Sidebar */}
        <VStack as="aside" align="stretch" spacing={2} bg={sidebarBg} minW="220px" p={4} borderRight="1px" borderColor={useColorModeValue('gray.100', 'gray.700')} display={{ base: 'none', md: 'flex' }}>
          <Button variant="ghost" justifyContent="flex-start" colorScheme="red" onClick={() => navigate('/')}>Home</Button>
          <Button variant="ghost" justifyContent="flex-start">Shorts</Button>
          <Button variant="ghost" justifyContent="flex-start">Subscriptions</Button>
          <Button variant="ghost" justifyContent="flex-start">Playlists</Button>
          <Button variant="ghost" justifyContent="flex-start">Liked Videos</Button>
        </VStack>
        {/* Main Content */}
        <Box flex={1} p={4}>
          {/* Category Chips */}
          <HStack spacing={3} mb={6} overflowX="auto">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                size="sm"
                colorScheme={selectedCategory === cat ? 'red' : 'gray'}
                variant={selectedCategory === cat ? 'solid' : 'ghost'}
                onClick={() => setSelectedCategory(cat)}
                borderRadius="full"
              >
                {cat}
              </Button>
            ))}
          </HStack>
          {/* Video Grid */}
          {loading && <Text>Loading...</Text>}
          {error && <Text color="red.400">{error}</Text>}
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {videos.map(video => (
              <Box
                key={video._id}
                bg={cardBg}
                borderRadius="lg"
                boxShadow="md"
                overflow="hidden"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-2px) scale(1.03)' }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => navigate(`/videos/${video._id}`)}
              >
                <Box w="100%" aspectRatio={16 / 9} bg="gray.200" overflow="hidden">
                  <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
                <Box p={4} display="flex" flexDirection="column" gap={2}>
                  <HStack spacing={3} align="center">
                    <Avatar name={video.owner?.username} size="sm" />
                    <Text fontWeight="bold" noOfLines={1}>{video.title}</Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.400">{video.owner?.username || 'Unknown'} • {video.views} views</Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage; 