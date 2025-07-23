import React, { useEffect, useState } from 'react';
import { Group, Button, Avatar, TextInput, SimpleGrid, Card, Text, useMantineTheme, ScrollArea, Loader, Box, Paper, Divider, Title, ActionIcon } from '@mantine/core';
import { IconSearch, IconPlus, IconHome2, IconPlaylistAdd, IconHeart, IconVideo, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';
const SIDEBAR_WIDTH = 270;


const sidebarLinks = [
  { label: 'Home', icon: <IconHome2 size={22} />, onClick: (navigate) => navigate('/') },
  { label: 'Shorts', icon: <IconVideo size={22} />, onClick: () => {} },
  { label: 'Subscriptions', icon: <IconUser size={22} />, onClick: () => {} },
];
const youLinks = [
  { label: 'Playlists', icon: <IconPlaylistAdd size={20} />, onClick: () => {} },
  { label: 'Liked Videos', icon: <IconHeart size={20} />, onClick: () => {} },
];

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();
  // Read user from localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('videomate_user');
    return stored ? JSON.parse(stored) : null;
  });
  // Sync user state if localStorage changes (optional, for multi-tab)
  useEffect(() => {
    const onStorage = () => {
      const stored = localStorage.getItem('videomate_user');
      setUser(stored ? JSON.parse(stored) : null);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE}/videos`)
      .then(res => setVideos(res.data.data.videos || []))
      .catch(() => setError('Failed to fetch videos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box style={{ minHeight: '100vh', background: theme.colors.dark[8], color: theme.white }}>
      {/* Fixed Sidebar */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: SIDEBAR_WIDTH,
          height: '100vh',
          background: theme.colors.dark[7],
          borderRight: `1px solid ${theme.colors.dark[5]}`,
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '2rem 0.5rem 1.5rem 0.5rem',
        }}
      >
        {/* VideoMate Logo */}
        <Text
          weight={900}
          size={30}
          color="red"
          style={{
            fontFamily: 'Montserrat, Inter, Times New Roman, sans-serif',
            letterSpacing: 2,
            marginBottom: 32,
            alignSelf: 'center',
            cursor: 'pointer',
            lineHeight: 2.1,
          }}
          onClick={() => navigate('/')}
        >
          VideoMate
        </Text>
        {/* Main links */}
        <Box style={{ width: '100%' }}>
          {sidebarLinks.map((link, idx) => (
            <Group key={link.label} spacing={16} align="center" style={{
              padding: '0.7rem 1.2rem',
              borderRadius: 10,
              background: idx === 0 ? theme.colors.dark[6] : 'transparent',
              color: theme.white,
              fontWeight: idx === 0 ? 700 : 500,
              fontSize: 18,
              marginBottom: 2,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
              onClick={() => link.onClick(navigate)}
              onMouseOver={e => e.currentTarget.style.background = theme.colors.dark[5]}
              onMouseOut={e => e.currentTarget.style.background = idx === 0 ? theme.colors.dark[6] : 'transparent'}
            >
              <ActionIcon color="gray" size={28} variant="transparent">
                {link.icon}
              </ActionIcon>
              <Text style={{ fontWeight: idx === 0 ? 700 : 500, fontSize: 17 }}>{link.label}</Text>
            </Group>
          ))}
        </Box>
        <Divider my={18} color={theme.colors.dark[4]} style={{ width: '90%', alignSelf: 'center' }} />
        {/* 'You' section */}
        <Text color="gray.4" mb={10} mt={8} style={{ letterSpacing: 1, fontWeight: 700, alignSelf: 'flex-start', fontSize: 15, marginLeft: 18 }}>You</Text>
        <Box style={{ width: '100%' }}>
          {youLinks.map(link => (
            <Group key={link.label} spacing={16} align="center" style={{
              padding: '0.7rem 1.2rem',
              borderRadius: 10,
              background: 'transparent',
              color: theme.white,
              fontWeight: 500,
              fontSize: 16,
              marginBottom: 2,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
              onClick={() => link.onClick(navigate)}
              onMouseOver={e => e.currentTarget.style.background = theme.colors.dark[5]}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <ActionIcon color="gray" size={26} variant="transparent">
                {link.icon}
              </ActionIcon>
              <Text style={{ fontWeight: 500, fontSize: 15 }}>{link.label}</Text>
            </Group>
          ))}
        </Box>
      </Box>
      {/* Fixed Header */}
      <Paper
        component="header"
        radius={0}
        p={0}
        style={{
          height: 64,
          background: theme.colors.dark[7],
          boxShadow: theme.shadows.md,
          position: 'fixed',
          top: 0,
          left: SIDEBAR_WIDTH,
          right: 0,
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
        }}
      >
        <Box style={{ width: 32 }} /> {/* Spacer for alignment */}
        <TextInput
          icon={<IconSearch size={20} />}
          placeholder="Search..."
          radius="xl"
          size="lg"
          style={{ width: 520, background: theme.colors.dark[6], color: theme.white }}
          styles={{ input: { background: theme.colors.dark[6], color: theme.white, fontSize: 18, padding: '1.1rem 1.2rem' } }}
        />
        <Group spacing={24} align="center">
          {user ? (
            <>
              <Button leftSection={<IconPlus size={20} />} color="red" radius="xl" size="lg" onClick={() => navigate('/videos/upload')}>Upload</Button>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: '2px solid #999',
                    background: theme.colors.dark[5],
                    marginLeft: 18,
                  }}
                  onClick={() => navigate('/profile')}
                />
              ) : (
                <Avatar
                  size="md"
                  radius="xl"
                  style={{
                    cursor: 'pointer',
                    border: '2px solid #999',
                    backgroundColor: theme.colors.dark[5],
                    marginLeft: 18,
                  }}
                  onClick={() => navigate('/profile')}
                >
                  <IconUser size={18} />
                </Avatar>
              )}


            </>
          ) : (
            <Button leftIcon={<IconUser size={20} />} color="red" radius="xl" size="lg" style={{ fontWeight: 700, letterSpacing: 1, boxShadow: theme.shadows.sm, padding: '0 1.5rem' }} onClick={() => navigate('/register')}>
              Login / Register
            </Button>
          )}
        </Group>
      </Paper>
      {/* Main Content */}
      <Box
        style={{
          marginLeft: SIDEBAR_WIDTH,
          marginTop: 64,
          padding: '2.5rem 2.5rem 2.5rem 2.5rem',
          width: `calc(100vw - ${SIDEBAR_WIDTH}px)`,
        }}
      >
        {/* Video Grid */}
        <Box px={0} py={12} style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          {loading && <Group position="center" mt="xl"><Loader color="red" /></Group>}
          {error && <Text color="red" align="center" mt="md">{error}</Text>}
          <SimpleGrid
            cols={3}
            spacing="2.2rem"
            breakpoints={[
              { maxWidth: 1200, cols: 2 },
              { maxWidth: 800, cols: 1 },
            ]}
            style={{ width: '100%' }}
          >
            {(videos.length > 0 ? videos : [
              {
                _id: 'dummy1',
                thumbnail: 'https://placehold.co/400x225/222/fff?text=Video+1',
                title: 'How to Build a Modern UI in React',
                owner: { username: 'JaneDoe', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                views: 1234
              },
              {
                _id: 'dummy2',
                thumbnail: 'https://placehold.co/400x225/333/fff?text=Video+2',
                title: 'Understanding JavaScript Closures',
                owner: { username: 'JohnSmith', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
                views: 5678
              },
              {
                _id: 'dummy3',
                thumbnail: 'https://placehold.co/400x225/444/fff?text=Video+3',
                title: 'CSS Grid vs Flexbox: Which Should You Use?',
                owner: { username: 'CodeMaster', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' },
                views: 91011
              },
              {
                _id: 'dummy4',
                thumbnail: 'https://placehold.co/400x225/555/fff?text=Video+4',
                title: 'Deploying Fullstack Apps with Vercel',
                owner: { username: 'DeployGuru', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
                views: 1213
              }
            ]).map(video => (
              <Card
                key={video._id}
                shadow="lg"
                p="0"
                radius="lg"
                style={{
                  cursor: 'pointer',
                  background: theme.colors.dark[6],
                  border: 'none',
                  minHeight: 220,

                }}
                onClick={() => video._id.startsWith('dummy') ? null : navigate(`/videos/${video._id}`)}
              >
                <Card.Section>
                  <img src={video.thumbnail} alt={video.title} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} />
                </Card.Section>
                <Group noWrap p="md" spacing={16}>
                  <Avatar radius="xl" size="md" src={video.owner?.avatar} />
                  <div style={{ flex: 1 }}>
                    <Text weight={600} size="lg" lineClamp={2} color={theme.white} mb={4}>{video.title}</Text>
                    <Text size="sm" color="gray.4">{video.owner?.username || 'Unknown'} • {video.views} views</Text>
                  </div>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage; 