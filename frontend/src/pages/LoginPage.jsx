import React, { useState } from 'react';
import { Paper, TextInput, PasswordInput, Button, Title, Text, Group, Avatar, useMantineTheme, Box, Divider, Alert } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconUser } from '@tabler/icons-react';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/400.css';

const API_BASE = 'http://localhost:3000/api/v1';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        email: form.email,
        password: form.password,
      };
      await axios.post(`${API_BASE}/users/login`, payload, { withCredentials: true });
      // Fetch user profile and store in localStorage
      const userRes = await axios.post(`${API_BASE}/users/current-user`, {}, { withCredentials: true });
      localStorage.setItem('videomate_user', JSON.stringify(userRes.data.data));
      // setUser(res.data.user); // This line was removed as per the edit hint
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
      return;
    } catch (err) {
      if (err.response) {
        setError(
          (err.response.data?.message ? err.response.data.message + ' ' : '') +
          (err.response.status ? `(HTTP ${err.response.status})` : '')
        );
      } else if (err.request) {
        setError('No response from server. Please check your network connection.');
      } else {
        setError('An unexpected error occurred: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{
      minHeight: '100vh',
      width: '100vw',
      background: `linear-gradient(120deg, ${theme.colors.dark[7]} 60%, ${theme.colors.red[8]} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Montserrat, Inter, Arial, sans-serif',
      padding: 0,
      boxSizing: 'border-box',
    }}>
      <Paper radius={32} p={56} withBorder shadow="xl" style={{ maxWidth: 600, minWidth: 520, width: '100%', background: theme.colors.dark[6], border: `1.5px solid ${theme.colors.dark[4]}`, borderRadius: 32, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)', fontFamily: 'Montserrat, Inter, Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 auto', padding: '3.5rem 2.5rem' }}>
        <Group position="center" mb="md" style={{ marginTop: 40 }}>
          <Title order={1} color="red" style={{ fontWeight: 900, letterSpacing: 2, fontFamily: 'Montserrat, Inter, Arial, sans-serif' }}>VideoMate</Title>
        </Group>
        <Title order={3} align="center" mb={24} style={{ fontWeight: 700, fontSize: 28, fontFamily: 'Montserrat, Inter, Arial, sans-serif', color: theme.colors.gray[2] }}>Sign in to VideoMate</Title>
        <form onSubmit={handleSubmit} style={{ marginBottom: 18, width: '100%', maxWidth: 480, margin: '0 auto' }}>
          <Group direction="column" spacing={24} grow>
            <Group spacing={18} align="center" noWrap>
              <Text style={{ minWidth: 120, fontWeight: 600, fontSize: 18, color: theme.colors.gray[3] }}>Email</Text>
              <TextInput
                name="email"
                value={form.email}
                onChange={handleChange}
                size="xl"
                radius={25}
                autoFocus
                style={{ fontFamily: 'Montserrat, Inter, Arial, sans-serif', flex: 1, minHeight: 56, width: '100%', fontSize: 16 }}
                styles={{
                  input: {
                    height: '56px',
                    width: '400px',
                    fontSize: '16px',
                    padding: '0 20px',
                    background: 'inherit',
                    color: 'inherit',
                    border: '1px solid #555',
                    borderRadius: 25,
                  }
                }}
              />
            </Group>
            <Group spacing={18} align="center" noWrap>
              <Text style={{ minWidth: 120, fontWeight: 600, fontSize: 18, color: theme.colors.gray[3] }}>Password</Text>
              <PasswordInput
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                size="xl"
                radius={25}
                style={{ fontFamily: 'Montserrat, Inter, Arial, sans-serif', flex: 1, minHeight: 56, width: '100%', fontSize: 16 }}
                styles={{
                  input: {
                    height: '56px',
                    width: '400px',
                    fontSize: '16px',
                    padding: '0 20px',
                    background: 'inherit',
                    color: 'inherit',
                    border: '1px solid #555',
                    borderRadius: 25,
                  }
                }}
              />
            </Group>
          </Group>
          {error && (
            <Alert color="red" radius={20} mt={18} mb="md" style={{ fontWeight: 600, fontFamily: 'Montserrat, Inter, Arial, sans-serif', fontSize: 16, textAlign: 'center' }} title="Login Error">
              {error}
            </Alert>
          )}
          {success && (
            <Alert color="green" radius={20} mt={18} mb="md" style={{ fontWeight: 600, fontFamily: 'Montserrat, Inter, Arial, sans-serif', fontSize: 16, textAlign: 'center' }} title="Success">
              {success}
            </Alert>
          )}
          <Button type="submit" color="red" fullWidth size="lg" radius="xl" loading={loading} style={{ fontWeight: 700, marginTop: 28, marginBottom: 8, fontFamily: 'Montserrat, Inter, Arial, sans-serif', fontSize: 18, letterSpacing: 1, minHeight: '50px' }}>Login</Button>
        </form>
        <Divider my={18} label="or" labelPosition="center" color={theme.colors.dark[3]} />
        <Text align="center" mt="md" style={{ fontWeight: 500, fontSize: 18, fontFamily: 'Montserrat, Inter, Arial, sans-serif', color: theme.colors.gray[4] }}>Don't have an account? <Button variant="subtle" color="red" size="md" style={{ fontWeight: 700, fontFamily: 'Montserrat, Inter, Arial, sans-serif' }} onClick={() => navigate('/register')}>Register</Button></Text>
      </Paper>
    </Box>
  );
};

export default LoginPage; 