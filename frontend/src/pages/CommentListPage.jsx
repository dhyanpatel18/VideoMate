import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Textarea, Button, VStack, Spinner, Alert, AlertIcon, List, ListItem, Avatar, HStack, Text } from '@chakra-ui/react';

const API_BASE = 'http://localhost:3000/api/v1';

const CommentListPage = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = () => {
    setLoading(true);
    axios.get(`${API_BASE}/comments/video/${videoId}`)
      .then(res => setComments(res.data.data.comments || []))
      .catch(() => setError('Failed to fetch comments'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [videoId]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`${API_BASE}/comments/video/${videoId}`, { content }, { withCredentials: true });
      setContent('');
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxW="700px" mx="auto" w="full">
      <Heading size="md" mb={4}>Comments</Heading>
      {user && (
        <form onSubmit={handleSubmit}>
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add a comment..."
            mb={2}
            required
          />
          <Button type="submit" colorScheme="red" isLoading={submitting} mb={6}>Post Comment</Button>
        </form>
      )}
      {loading && <Spinner size="xl" color="red.500" />}
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <VStack align="stretch" spacing={4}>
        {comments.map(comment => (
          <ListItem key={comment._id} p={4} bg="white" borderRadius="md" boxShadow="sm">
            <HStack spacing={3} mb={1}>
              <Avatar name={comment.owner?.username} size="sm" />
              <Text fontWeight="bold">{comment.owner?.username || 'User'}</Text>
            </HStack>
            <Text>{comment.content}</Text>
          </ListItem>
        ))}
      </VStack>
    </Box>
  );
};

export default CommentListPage; 