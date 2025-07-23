import React, { useEffect, useState } from 'react';
import { AppShell, Navbar, Header, Group, Button, Avatar, TextInput, SimpleGrid, Card, Text, useMantineTheme, ScrollArea, SegmentedControl, Loader } from '@mantine/core';
import { IconSearch, IconPlus, IconSun, IconMoon } from '@tabler/icons-react';
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
  const theme = useMantineTheme();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/videos`)
      .then(res => setVideos(res.data.data.videos || []))
      .catch(() => setError('Failed to fetch videos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 220 }} p="md">
        <Navbar.Section>
          <Button variant="subtle" fullWidth mb="sm" onClick={() => navigate('/')}>Home</Button>
          <Button variant="subtle" fullWidth mb="sm">Shorts</Button>
          <Button variant="subtle" fullWidth mb="sm">Subscriptions</Button>
          <Button variant="subtle" fullWidth mb="sm">Playlists</Button>
          <Button variant="subtle" fullWidth mb="sm">Liked Videos</Button>
        </Navbar.Section>
      </Navbar>}
      header={<Header height={60} p="xs">
        <Group position="apart" align="center" style={{ height: '100%' }}>
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
        </Group>
      </Header>}
      styles={{ main: { background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0] } }}
    >
      <ScrollArea type="never" offsetScrollbars>
        <SegmentedControl
          data={CATEGORIES}
          value={selectedCategory}
          onChange={setSelectedCategory}
          fullWidth
          color="red"
          mb="lg"
        />
        {loading && <Group position="center" mt="xl"><Loader color="red" /></Group>}
        {error && <Text color="red" align="center" mt="md">{error}</Text>}
        <SimpleGrid cols={4} spacing="lg" breakpoints={[
          { maxWidth: 1200, cols: 3 },
          { maxWidth: 900, cols: 2 },
          { maxWidth: 600, cols: 1 },
        ]}>
          {videos.map(video => (
            <Card key={video._id} shadow="md" p="0" radius="md" style={{ cursor: 'pointer' }} onClick={() => navigate(`/videos/${video._id}`)}>
              <Card.Section>
                <img src={video.thumbnail} alt={video.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
              </Card.Section>
              <Group noWrap p="md">
                <Avatar radius="xl" size="md" />
                <div style={{ flex: 1 }}>
                  <Text weight={600} size="md" lineClamp={2}>{video.title}</Text>
                  <Text size="sm" color="dimmed">{video.owner?.username || 'Unknown'} • {video.views} views</Text>
                </div>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      </ScrollArea>
    </AppShell>
  );
};

export default HomePage; 