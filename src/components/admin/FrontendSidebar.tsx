'use client';

import { Box, Flex, HStack, Icon, Link, Separator, Text, VStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import {
  LuBuilding,
  LuLayoutDashboard,
  LuPackage,
  LuSettings,
  LuUser,
  LuUsers,
} from 'react-icons/lu';

interface NavItem {
  label: string;
  href: string;
  icon: typeof LuLayoutDashboard;
}

const baseNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LuLayoutDashboard },
  { label: 'My Companies', href: '/companies', icon: LuBuilding },
];

const settingsItems: NavItem[] = [
  { label: 'Settings', href: '/settings', icon: LuSettings },
];

export const FrontendSidebar = () => {
  const pathname = usePathname();

  // Extract company ID if on company route
  const isCompanyRoute = pathname.startsWith('/company/');
  const companyId = isCompanyRoute ? pathname.split('/')[2] : null;

  // Build dynamic nav items
  const navItems = [...baseNavItems];
  if (isCompanyRoute && companyId) {
    navItems.push({
      label: 'Manage Suppliers',
      href: `/company/${companyId}/suppliers`,
      icon: LuUsers,
    });
    navItems.push({
      label: 'Manage Items',
      href: `/company/${companyId}/items`,
      icon: LuPackage,
    });
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Flex
      direction="column"
      w={{ base: 'full', lg: '64' }}
      h="full"
      bg={{ base: 'gray.100', _dark: 'gray.900' }}
      borderRightWidth="1px"
      borderColor="border.subtle"
      position={{ base: 'relative', lg: 'sticky' }}
      top="0"
      overflowY="auto"
    >
      {/* Logo Section */}
      <Flex
        h="16"
        alignItems="center"
        px="6"
        borderBottomWidth="1px"
        borderColor="border.subtle"
      >
        <Text fontSize="xl" fontWeight="bold" color="#ed5d43">
          POMS
        </Text>
      </Flex>

      {/* Navigation */}
      <VStack flex="1" gap="1" p="4" alignItems="stretch">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              _hover={{ textDecoration: 'none' }}
            >
              <HStack
                px="3"
                py="2.5"
                rounded="md"
                cursor="pointer"
                bg={active ? 'blackAlpha.50' : 'transparent'}
                borderLeftWidth="3px"
                borderColor={active ? '#ed5d43' : 'transparent'}
                color={active ? '#ed5d43' : 'fg.muted'}
                fontWeight={active ? 'semibold' : 'medium'}
                transition="all 0.2s ease"
                _hover={{
                  bg: 'blackAlpha.50',
                  color: active ? '#ed5d43' : 'fg',
                }}
              >
                <Icon fontSize="lg">
                  <item.icon />
                </Icon>
                <Text fontSize="sm">{item.label}</Text>
              </HStack>
            </Link>
          );
        })}
      </VStack>

      {/* Settings Footer */}
      <Box p="4" borderTopWidth="1px" borderColor="border.subtle">
        <VStack gap="1" alignItems="stretch">
          {settingsItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                _hover={{ textDecoration: 'none' }}
              >
                <HStack
                  px="3"
                  py="2.5"
                  rounded="md"
                  cursor="pointer"
                  bg={active ? 'blackAlpha.50' : 'transparent'}
                  borderLeftWidth="3px"
                  borderColor={active ? '#ed5d43' : 'transparent'}
                  color={active ? '#ed5d43' : 'fg.muted'}
                  fontWeight={active ? 'semibold' : 'medium'}
                  transition="all 0.2s ease"
                  _hover={{
                    bg: 'blackAlpha.50',
                    color: active ? '#ed5d43' : 'fg',
                  }}
                >
                  <Icon fontSize="lg">
                    <item.icon />
                  </Icon>
                  <Text fontSize="sm">{item.label}</Text>
                </HStack>
              </Link>
            );
          })}
        </VStack>
      </Box>
    </Flex>
  );
};
