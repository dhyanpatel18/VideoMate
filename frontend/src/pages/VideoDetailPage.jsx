import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Group, Button, Avatar, TextInput, Card, Text, useMantineTheme, SimpleGrid, Loader, Box, Flex, Title, Divider, ScrollArea } from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

const VideoDetailPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useMantineTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/videos/${videoId}`)
      .then(res => setVideo(res.data.data))
      .catch(() => setError('Failed to fetch video'))
      .finally(() => setLoading(false));
    axios.get(`${API_BASE}/videos`)
      .then(res => {
        const vids = res.data.data.videos || [];
        setRelated(vids.filter(v => v._id !== videoId).slice(0, 6));
      })
      .catch(() => setRelated([]));
  }, [videoId]);

  return (
    <Flex direction="column" minH="100vh" bg={theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]}>
      
      <Box
        component="header"
        sx={{
          height: 60,
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          boxShadow: theme.shadows.sm,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Text weight={700} size="xl" color="red" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>VideoMate</Text>
        <TextInput
          icon={<IconSearch size={18} />}
          placeholder="Search..."
          radius="md"
          style={{ width: 350 }}
        />
        <Group>
          <Button leftIcon={<IconPlus size={18} />} color="red" onClick={() => navigate('/videos/upload')}>Upload</Button>
          <Avatar radius="xl" />
        </Group>
      </Box>
      <Flex flex={1}>
       
        <Box
          as="aside"
          bg={theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white}
          p="md"
          sx={{
            minWidth: 220,
            borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            display: 'none',
            '@media (min-width: 900px)': { display: 'block' }
          }}
        >
          <Button variant="subtle" fullWidth mb="sm" onClick={() => navigate('/')}>Home</Button>
          <Button variant="subtle" fullWidth mb="sm">Shorts</Button>
          <Button variant="subtle" fullWidth mb="sm">Subscriptions</Button>
          <Button variant="subtle" fullWidth mb="sm">Playlists</Button>
          <Button variant="subtle" fullWidth mb="sm">Liked Videos</Button>
        </Box>
       
        <Box flex={1} p={4}>
          <ScrollArea type="never" offsetScrollbars>
            {loading && <Group position="center" mt="xl"><Loader color="red" /></Group>}
            {error && <Text color="red" align="center" mt="md">{error}</Text>}
            {video && (
              <Flex gap={32} direction={{ base: 'column', md: 'row' }} align="flex-start" maxW={1400} mx="auto">
                <Box flex={2} minW={0}>
                  <Box w="100%" bg="black" radius="md" mb="md" style={{ overflow: 'hidden' }}>
                    <video src={video.videoFile} controls poster={video.thumbnail} style={{ width: '100%', borderRadius: 8 }} />
                  </Box>
                  <Title order={2} mb={8}>{video.title}</Title>
                  <Group mb={2} spacing={8} align="center">
                    <Avatar name={video.owner?.username} size="md" />
                    <Text weight={700}>{video.owner?.username || 'Unknown'}</Text>
                    <Text color="dimmed">{video.views} views</Text>
                  </Group>
                  <Text size="md" mb={4}>{video.description}</Text>
                  <Group spacing={8} mb={6}>
                    <Button color="red">Like</Button>
                    <Button>Subscribe</Button>
                  </Group>
                  <Divider mb={4} />
                </Box>
                <Box flex={1} w="100%" maw={320}>
                  <Title order={4} mb={2}>Related Videos</Title>
                  <SimpleGrid cols={1} spacing="md">
                    {related.map(v => (
                      <Card key={v._id} shadow="sm" p="0" radius="md" style={{ cursor: 'pointer' }} onClick={() => navigate(`/videos/${v._id}`)}>
                        <Card.Section>
                          <img src={v.thumbnail} alt={v.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                        </Card.Section>
                        <Group noWrap p="md">
                          <Avatar radius="xl" size="md" />
                          <div style={{ flex: 1 }}>
                            <Text weight={600} size="md" lineClamp={2}>{v.title}</Text>
                            <Text size="sm" color="dimmed">{v.owner?.username || 'Unknown'} • {v.views} views</Text>
                          </div>
                        </Group>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              </Flex>
            )}
          </ScrollArea>
        </Box>
      </Flex>
    </Flex>
  );
};

export default VideoDetailPage; 