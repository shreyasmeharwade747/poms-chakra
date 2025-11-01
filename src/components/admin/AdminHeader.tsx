'use client';

import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { LuBell, LuLogOut, LuMenu, LuSettings, LuUser } from 'react-icons/lu';

import { ColorModeButton } from '@/components/ui/color-mode';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { data: session, status } = useSession();

  const userName = session?.user?.name || 'Admin User';
  const userEmail = session?.user?.email || 'admin@poms.com';

  return (
    <Flex
      as="header"
      h="16"
      alignItems="center"
      justifyContent="space-between"
      px={{ base: '4', md: '6' }}
      bg="bg.panel"
      borderBottomWidth="1px"
      borderColor="border.subtle"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      {/* Left Section - Mobile Menu */}
      <HStack gap="3">
        <IconButton
          display={{ base: 'flex', lg: 'none' }}
          onClick={onMenuClick}
          variant="ghost"
          aria-label="Open menu"
          size="sm"
        >
          <LuMenu />
        </IconButton>

        <Box display={{ base: 'block', lg: 'none' }}>
          <Text fontSize="lg" fontWeight="bold" color="#ed5d43">
            POMS
          </Text>
        </Box>
      </HStack>

      {/* Right Section - Actions */}
      <HStack gap="2">
        {/* Theme Toggle */}
        <ColorModeButton />

        {/* User Menu */}
        <MenuRoot>
          <MenuTrigger asChild>
            <Flex
              as="button"
              alignItems="center"
              gap="3"
              px="2"
              py="1.5"
              rounded="md"
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{ bg: 'blackAlpha.50' }}
            >
              <Avatar.Root size="sm">
                <Avatar.Fallback name={userName} bg="#ed5d43" color="white" />
              </Avatar.Root>
              <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                <Text fontSize="sm" fontWeight="medium" lineHeight="1.2">
                  {userName}
                </Text>
                <Text fontSize="xs" color="fg.muted" lineHeight="1.2">
                  {userEmail}
                </Text>
              </Box>
            </Flex>
          </MenuTrigger>
          <Portal>
            <MenuPositioner>
              <MenuContent minW="xs">
                <Box p="3" borderBottomWidth="1px" borderColor="border.subtle">
                  <Text fontWeight="semibold" fontSize="sm">
                    {userName}
                  </Text>
                  <Text fontSize="xs" color="fg.muted">
                    {userEmail}
                  </Text>
                </Box>
                <MenuItem value="profile">
                  <Icon fontSize="lg">
                    <LuUser />
                  </Icon>
                  <Text fontSize="sm">Profile</Text>
                </MenuItem>
                <MenuItem value="settings">
                  <Icon fontSize="lg">
                    <LuSettings />
                  </Icon>
                  <Text fontSize="sm">Settings</Text>
                </MenuItem>
                <Box borderTopWidth="1px" borderColor="border.subtle" my="1" />
                <MenuItem value="logout" color="#ed5d43" onClick={async () => {
                  await signOut({ callbackUrl: '/login' });
                }}>
                  <Icon fontSize="lg">
                    <LuLogOut />
                  </Icon>
                  <Text fontSize="sm">Logout</Text>
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </MenuRoot>
      </HStack>
    </Flex>
  );
};
