import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, Flex, HStack, VStack, Avatar, Button, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerBody, useDisclosure, useBreakpointValue, Text, Input, InputGroup, InputLeftElement
} from '@chakra-ui/react';
import { HamburgerIcon, SearchIcon } from '@chakra-ui/icons';

const navLinks = [
  { label: 'Home', to: '/videos' },
  { label: 'Playlists', to: '/playlists' },
  { label: 'Liked Videos', to: '/likes' },
  { label: 'Tweets', to: '/tweets' },
  { label: 'Healthcheck', to: '/healthcheck' },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const Sidebar = (
    <VStack align="stretch" spacing={6} p={4} minW="180px">
      {navLinks.map(link => (
        <Button
          as={Link}
          to={link.to}
          variant="ghost"
          colorScheme="red"
          key={link.to}
          justifyContent="flex-start"
        >
          {link.label}
        </Button>
      ))}
    </VStack>
  );

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      {/* Header */}
      <Flex as="header" align="center" justify="space-between" px={8} py={3} bg="white" boxShadow="sm" position="sticky" top={0} zIndex={10}>
        <HStack spacing={4}>
          {isMobile && (
            <IconButton icon={<HamburgerIcon />} variant="ghost" onClick={onOpen} aria-label="Open menu" />
          )}
          <Text fontSize="2xl" fontWeight="bold" color="red.500" cursor="pointer" onClick={() => navigate('/videos')}>VideoMate</Text>
        </HStack>
        <Box flex={1} maxW="400px" mx={8}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input type="text" placeholder="Search..." bg="gray.100" borderRadius="md" />
          </InputGroup>
        </Box>
        <HStack spacing={4}>
          {user && <Button colorScheme="red" onClick={() => navigate('/videos/upload')}>Upload</Button>}
          {user ? (
            <HStack spacing={2}>
              <Avatar name={user.username} size="sm" />
              <Text>{user.username}</Text>
              <Button size="sm" onClick={logout}>Logout</Button>
            </HStack>
          ) : (
            <>
              <Button size="sm" onClick={() => navigate('/login')}>Login</Button>
              <Button size="sm" colorScheme="red" onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </HStack>
      </Flex>
      {/* Body */}
      <Flex flex={1}>
        {/* Sidebar */}
        {isMobile ? (
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerBody>{Sidebar}</DrawerBody>
            </DrawerContent>
          </Drawer>
        ) : (
          <Box as="aside" w="220px" bg="white" borderRight="1px" borderColor="gray.100" minH="80vh" display={{ base: 'none', md: 'block' }}>
            {Sidebar}
          </Box>
        )}
        {/* Main Content */}
        <Box as="main" flex={1} p={{ base: 3, md: 8 }} minW={0}>
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout; 