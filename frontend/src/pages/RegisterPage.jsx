import React, { useState } from 'react';
import { Paper, TextInput, PasswordInput, Button, Title, Text, Group, Avatar, useMantineTheme, Box, Divider } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconUser } from '@tabler/icons-react';

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
    <Box style={{ minHeight: '100vh', background: `linear-gradient(120deg, ${theme.colors.dark[7]} 60%, ${theme.colors.red[8]} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper radius={24} p={36} withBorder shadow="2xl" style={{ minWidth: 400, maxWidth: 420, background: theme.colors.dark[6], border: `1.5px solid ${theme.colors.dark[4]}` }}>
        <Group position="center" mb="md">
          <Avatar size={56} radius="xl" color="red"><IconUser size={32} /></Avatar>
          <Title order={1} color="red" style={{ fontWeight: 900, letterSpacing: 2 }}>VideoMate</Title>
        </Group>
        <Title order={3} align="center" mb={24} style={{ fontWeight: 700, fontSize: 28 }}>Create your VideoMate account</Title>
        <form onSubmit={handleSubmit} style={{ marginBottom: 18 }}>
          <TextInput
            label="Full Name"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            required
            mb="md"
            size="md"
            radius="md"
            autoFocus
          />
          <TextInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            mb="md"
            size="md"
            radius="md"
          />
          <TextInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            mb="md"
            size="md"
            radius="md"
          />
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            mb="md"
            size="md"
            radius="md"
          />
          {error && <Text color="red" mb="md" align="center" style={{ fontWeight: 600 }}>{error}</Text>}
          <Button type="submit" color="red" fullWidth size="lg" radius="xl" loading={loading} style={{ fontWeight: 700, marginTop: 8, marginBottom: 8 }}>Register</Button>
        </form>
        <Divider my={18} label="or" labelPosition="center" color={theme.colors.dark[3]} />
        <Text align="center" mt="md" style={{ fontWeight: 500, fontSize: 16 }}>Already have an account? <Button variant="subtle" color="red" size="md" style={{ fontWeight: 700 }} onClick={() => navigate('/login')}>Login</Button></Text>
      </Paper>
    </Box>
  );
};

export default RegisterPage; 