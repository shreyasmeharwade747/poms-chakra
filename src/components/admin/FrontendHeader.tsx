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
import { usePathname, useParams } from 'next/navigation';
import { LuLogOut, LuMenu, LuSettings, LuUser, LuBuilding } from 'react-icons/lu';
import { useEffect, useState } from 'react';

import { ColorModeButton } from '@/components/ui/color-mode';

interface FrontendHeaderProps {
  onMenuClick?: () => void;
}

export const FrontendHeader = ({ onMenuClick }: FrontendHeaderProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const params = useParams();
  const [company, setCompany] = useState<{ id: string; name: string } | null>(null);

  const userName = session?.user?.name || 'User';
  const userEmail = session?.user?.email || 'user@poms.com';

  const isCompanyRoute = pathname.startsWith('/company/');
  const companyId = isCompanyRoute ? (params.id as string) : null;

  useEffect(() => {
    if (isCompanyRoute && companyId && !company) {
      // Fetch company data
      const fetchCompany = async () => {
        try {
          const response = await fetch(`/api/company/${companyId}`);
          if (response.ok) {
            const { data } = await response.json();
            setCompany({ id: data.id, name: data.name });
          }
        } catch (error) {
          console.error('Failed to fetch company:', error);
        }
      };

      fetchCompany();
    } else if (!isCompanyRoute) {
      // Clear company data when not in company route
      setCompany(null);
    }
  }, [isCompanyRoute, companyId, company]);

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
      {/* Left Section */}
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

        {isCompanyRoute && company ? (
          /* Company Context - Desktop and Mobile */
          <HStack gap="2">
            <Icon as={LuBuilding} boxSize="5" color="#ed5d43" />
            <Box>
              <Text fontSize="sm" color="fg.muted">
                Current Company
              </Text>
              <Text fontSize="md" fontWeight="semibold" color="#ed5d43">
                {company.name}
              </Text>
            </Box>
          </HStack>
        ) : (
          /* Default POMS Logo - Mobile only */
          <Box display={{ base: 'block', lg: 'none' }}>
            <Text fontSize="lg" fontWeight="bold" color="#ed5d43">
              POMS
            </Text>
          </Box>
        )}
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
