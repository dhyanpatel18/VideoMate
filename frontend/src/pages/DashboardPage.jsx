import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Stat, StatLabel, StatNumber, SimpleGrid, Card, CardBody, Spinner, Alert, AlertIcon, List, ListItem } from '@chakra-ui/react';

const API_BASE = 'http://localhost:3000/api/v1';

const DashboardPage = () => {
  const { channelId } = useParams();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_BASE}/dashboard/${channelId}/stats`),
      axios.get(`${API_BASE}/dashboard/${channelId}/videos`)
    ])
      .then(([statsRes, videosRes]) => {
        setStats(statsRes.data.data);
        setVideos(videosRes.data.data);
      })
      .catch(() => setError('Failed to fetch dashboard data'))
      .finally(() => setLoading(false));
  }, [channelId]);

  if (loading) return <Spinner size="xl" color="red.500" />;
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>;
  if (!stats) return <Box>No stats found</Box>;

  return (
    <Box maxW="1000px" mx="auto" w="full">
      <Heading size="lg" mb={6}>Channel Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
        <Card><CardBody><Stat><StatLabel>Total Videos</StatLabel><StatNumber>{stats.totalVideos}</StatNumber></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>Total Views</StatLabel><StatNumber>{stats.totalViews}</StatNumber></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>Total Subscribers</StatLabel><StatNumber>{stats.totalSubscribers}</StatNumber></Stat></CardBody></Card>
        <Card><CardBody><Stat><StatLabel>Total Likes</StatLabel><StatNumber>{stats.totalLikes}</StatNumber></Stat></CardBody></Card>
      </SimpleGrid>
      <Heading size="md" mb={2}>Channel Videos</Heading>
      <List spacing={3}>
        {videos.map(video => (
          <ListItem key={video._id}>{video.title}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DashboardPage; 