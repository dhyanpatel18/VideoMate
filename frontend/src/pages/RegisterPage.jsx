import React, { useState } from 'react';
import { Paper, TextInput, PasswordInput, Button, Title, Text, Group, Avatar, useMantineTheme, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/v1';

const RegisterPage = ({ setUser }) => {
  const [form, setForm] = useState({ fullname: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/users/register`, form, { withCredentials: true });
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ minHeight: '100vh', background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper radius="md" p="xl" withBorder shadow="xl" style={{ minWidth: 350, background: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white }}>
        <Group position="center" mb="md">
          <Avatar size={48} radius="xl" color="red">V</Avatar>
          <Title order={2} color="red">VideoMate</Title>
        </Group>
        <Title order={3} align="center" mb="lg">Create your VideoMate account</Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Full Name"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            required
            mb="md"
            size="md"
          />
          <TextInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            mb="md"
            size="md"
          />
          <TextInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            mb="md"
            size="md"
          />
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            mb="md"
            size="md"
          />
          {error && <Text color="red" mb="md">{error}</Text>}
          <Button type="submit" color="red" fullWidth size="md" loading={loading} mb="md">Register</Button>
        </form>
        <Text align="center" mt="md">Already have an account? <Button variant="subtle" color="red" onClick={() => navigate('/login')}>Login</Button></Text>
      </Paper>
    </Box>
  );
};

export default RegisterPage; 