import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Textarea, Button, VStack, Spinner, Alert, AlertIcon, List, ListItem, Avatar, HStack, Text } from '@chakra-ui/react';

const API_BASE = 'http://localhost:3000/api/v1';

const TweetListPage = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTweets = () => {
    if (!user) return;
    setLoading(true);
    axios.get(`${API_BASE}/tweets/user/${user._id}`)
      .then(res => setTweets(res.data.data))
      .catch(() => setError('Failed to fetch tweets'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTweets();
    // eslint-disable-next-line
  }, [user]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`${API_BASE}/tweets`, { content }, { withCredentials: true });
      setContent('');
      fetchTweets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tweet');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return <Box p={8}><Heading size="md">Please log in to view your tweets.</Heading></Box>;

  return (
    <Box maxW="700px" mx="auto" w="full">
      <Heading size="lg" mb={6}>Your Tweets</Heading>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="What's happening?"
          mb={2}
          required
        />
        <Button type="submit" colorScheme="red" isLoading={submitting} mb={6}>Tweet</Button>
      </form>
      {loading && <Spinner size="xl" color="red.500" />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <VStack align="stretch" spacing={4}>
        {tweets.map(tweet => (
          <ListItem key={tweet._id} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <HStack spacing={3} mb={1}>
              <Avatar name={tweet.owner?.username} size="sm" />
              <Text fontWeight="bold">{tweet.owner?.username || 'You'}</Text>
            </HStack>
            <Text>{tweet.content}</Text>
          </ListItem>
        ))}
      </VStack>
    </Box>
  );
};

export default TweetListPage; 