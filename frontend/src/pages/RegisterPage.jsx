import React, { useState } from 'react';
import { Paper, TextInput, PasswordInput, Button, Title, Text, Group, Avatar, useMantineTheme, Box, Divider } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconUser } from '@tabler/icons-react';
import { useRef } from 'react';


import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/400.css';


const API_BASE = 'http://localhost:3000/api/v1';


const RegisterPage = ({ setUser }) => {
  const [form, setForm] = useState({ fullname: '', username: '', email: '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const avatarInputRef = useRef();
  const coverInputRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();


  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    setAvatar(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : null);
  };
  const handleCoverChange = e => {
    const file = e.target.files[0];
    setCoverImage(file);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };


  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('fullname', form.fullname);
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      if (avatar) formData.append('avatar', avatar);
      if (coverImage) formData.append('coverImage', coverImage);
      const res = await axios.post(`${API_BASE}/users/register`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Store user object with avatar/coverImage in localStorage
      localStorage.setItem('videomate_user', JSON.stringify(res.data.data));
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
      <Paper
        radius={32}
        p={56}
        withBorder
        shadow="xl"
        style={{
          maxWidth: 700,
          minWidth: 520,
          width: '100%',
          background: theme.colors.dark[6],
          border: `1.5px solid ${theme.colors.dark[4]}`,
          borderRadius: 32,
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
          fontFamily: 'Montserrat, Inter, Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 auto',
          padding: '3.5rem 2.5rem',
        }}
      >
        <Group position="center" mb="md" style={{ marginTop: 40 }}>
         
          <Title order={1} color="red" style={{ fontWeight: 900, letterSpacing: 2, fontFamily: 'Montserrat, Inter, Arial, sans-serif' }}>VideoMate</Title>
        </Group>
        <Title order={3} align="center" mb={24} style={{ fontWeight: 700, fontSize: 28, fontFamily: 'Montserrat, Inter, Arial, sans-serif', color: theme.colors.gray[2] }}>Create your VideoMate account</Title>
        <form onSubmit={handleSubmit} style={{ marginBottom: 18, width: '100%', maxWidth: 480, margin: '0 auto' }}>
          <Group direction="column" spacing={24} grow>
            <Group spacing={18} align="center" noWrap>
              <Text style={{ minWidth: 120, fontWeight: 600, fontSize: 18, color: theme.colors.gray[3] }}>Full Name</Text>
              <TextInput
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                required
                size="xl"
                radius={25}
                autoFocus
                style={{ 
                  fontFamily: 'Montserrat, Inter, Arial, sans-serif', 
                  flex: 1, 
                  minHeight: 56, 
                  width: '100%', 
                  fontSize: 16
                }}
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
              <Text style={{ minWidth: 120, fontWeight: 600, fontSize: 18, color: theme.colors.gray[3] }}>Username</Text>
              <TextInput
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                size="xl"
                radius={25}
                style={{ 
                  fontFamily: 'Montserrat, Inter, Arial, sans-serif', 
                  flex: 1, 
                  minHeight: 56, 
                  width: '100%', 
                  fontSize: 16
                }}
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
              <Text style={{ minWidth: 120, fontWeight: 600, fontSize: 18, color: theme.colors.gray[3] }}>Email</Text>
              <TextInput
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                size="xl"
                radius={25}
                style={{ 
                  fontFamily: 'Montserrat, Inter, Arial, sans-serif', 
                  flex: 1, 
                  minHeight: 56, 
                  width: '100%', 
                  fontSize: 16
                }}
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
                style={{ 
                  fontFamily: 'Montserrat, Inter, Arial, sans-serif', 
                  flex: 1, 
                  minHeight: 56, 
                  width: '100%', 
                  fontSize: 16
                }}
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
           {/* Avatar upload */}
           <Group spacing={18} align="center" noWrap>
             <Text style={{ minWidth: 120, fontWeight: 600, fontSize: 18, color: theme.colors.gray[3] }}>Avatar</Text>
             <input
               type="file"
               accept="image/*"
               required
               ref={avatarInputRef}
               style={{ display: 'none' }}
               onChange={handleAvatarChange}
             />
             <Button
               variant="outline"
               color="red"
               radius={25}
               size="md"
               style={{ width: 180, fontWeight: 600 }}
               onClick={() => avatarInputRef.current.click()}
             >
               {avatar ? 'Change Avatar' : 'Upload Avatar'}
             </Button>
             {avatarPreview && (
               <img src={avatarPreview} alt="Avatar Preview" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', marginLeft: 16, border: '2px solid #555' }} />
             )}
           </Group>
           {/* Cover image upload */}
           <Group spacing={18} align="center" noWrap>
             <Text style={{ minWidth: 120, fontWeight: 600, fontSize: 18, color: theme.colors.gray[3] }}>Cover Image</Text>
             <input
               type="file"
               accept="image/*"
               ref={coverInputRef}
               style={{ display: 'none' }}
               onChange={handleCoverChange}
             />
             <Button
               variant="outline"
               color="red"
               radius={25}
               size="md"
               style={{ width: 180, fontWeight: 600 }}
               onClick={() => coverInputRef.current.click()}
             >
               {coverImage ? 'Change Cover' : 'Upload Cover'}
             </Button>
             {coverPreview && (
               <img src={coverPreview} alt="Cover Preview" style={{ width: 72, height: 48, borderRadius: 12, objectFit: 'cover', marginLeft: 16, border: '2px solid #555' }} />
             )}
           </Group>
          </Group>
          
          {error && <Text color="red" mt={18} mb="md" align="center" style={{ fontWeight: 600, fontFamily: 'Montserrat, Inter, Arial, sans-serif' }}>{error}</Text>}
          <Button type="submit" color="red" fullWidth size="lg" radius="xl" loading={loading} style={{ fontWeight: 700, marginTop: 28, marginBottom: 8, fontFamily: 'Montserrat, Inter, Arial, sans-serif', fontSize: 18, letterSpacing: 1, minHeight: '50px' }}>Register</Button>
        </form>
        <Divider my={18} label="or" labelPosition="center" color={theme.colors.dark[3]} />
        <Text align="center" mt="md" style={{ fontWeight: 500, fontSize: 18, fontFamily: 'Montserrat, Inter, Arial, sans-serif', color: theme.colors.gray[4] }}>Already have an account? <Button variant="subtle" color="red" size="md" style={{ fontWeight: 700, fontFamily: 'Montserrat, Inter, Arial, sans-serif' }} onClick={() => navigate('/login')}>Login</Button></Text>
      </Paper>
    </Box>
  );
};


export default RegisterPage;
