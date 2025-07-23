import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Heading, Input, Button, VStack, Alert, AlertIcon, Spinner, Text, Flex } from '@chakra-ui/react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate('/videos');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" minW="350px">
        <Heading size="lg" mb={6} color="red.500">Login to VideoMate</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Input
              type="text"
              name="username"
              placeholder="Username or Email"
              value={form.username}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Button type="submit" colorScheme="red" isLoading={loading}>Login</Button>
            {error && <Alert status="error"><AlertIcon />{error}</Alert>}
          </VStack>
        </form>
        <Text mt={4} textAlign="center">Don't have an account? <Button variant="link" colorScheme="red" onClick={() => navigate('/register')}>Register</Button></Text>
      </Box>
    </Flex>
  );
};

export default LoginPage; 