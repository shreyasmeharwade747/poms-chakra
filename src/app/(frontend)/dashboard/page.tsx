'use client';

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  LuBuilding,
  LuPlus,
  LuSettings,
  LuUsers,
  LuPencil,
} from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Company = {
  id: string;
  name: string;
  gstin: string | null;
  pan: string | null;
  address: string | null;
  stateCode: string | null;
  email: string | null;
  phone: string | null;
  logoUrl: string | null;
};

// Mock data for pending purchase orders
const mockPendingOrders = [
  {
    id: 'PO-001',
    partyName: 'Tech Suppliers Ltd',
    date: '2024-01-15',
    total: '₹45,000',
    status: 'Draft',
  },
  {
    id: 'PO-002',
    partyName: 'Office Equipment Co',
    date: '2024-01-14',
    total: '₹28,500',
    status: 'Pending Approval',
  },
  {
    id: 'PO-003',
    partyName: 'Stationery World',
    date: '2024-01-13',
    total: '₹12,300',
    status: 'Draft',
  },
];

const DashboardPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) throw new Error('Failed to fetch companies');
        const { data } = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        // Keep loading false even on error to show empty state
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);
  return (
    <Box p="6" maxW="7xl" mx="auto">
      <VStack gap="8" align="stretch">
        {/* My Companies Section */}
        <Box>
          <Flex align="center" justify="space-between" wrap="wrap" gap="4" mb="6">
            <Heading size="lg" color="#ed5d43">
              My Companies
            </Heading>
            <Button asChild colorScheme="orange" variant="solid">
              <Link href="/companies/create-company">
                <Flex align="center" gap="2">
                  <Icon as={LuPlus} boxSize="5" />
                  <Text>Create Company</Text>
                </Flex>
              </Link>
            </Button>
          </Flex>

          {loadingCompanies ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
              <Skeleton height="180px" />
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
              {companies.map((company) => (
                <Card.Root
                  key={company.id}
                  _hover={{ shadow: 'lg', cursor: 'pointer' }}
                  transition="all 0.2s"
                  onClick={() => router.push(`/company/${company.id}`)}
                >
                  <Card.Body>
                    <VStack align="start" gap="3">
                      <Flex justify="space-between" width="full">
                        <Flex align="center" gap="2">
                          <Icon as={LuBuilding} boxSize="5" color="#ed5d43" />
                          <Heading size="md">{company.name}</Heading>
                        </Flex>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/companies/edit-company/${company.id}`);
                          }}
                        >
                          <Icon as={LuPencil} boxSize="4" />
                        </Button>
                      </Flex>
                      {company.gstin && (
                        <Text fontSize="sm" color="fg.muted">
                          GSTIN: {company.gstin}
                        </Text>
                      )}
                      {company.address && (
                        <Text fontSize="sm" color="fg.muted">
                          {company.address}
                          {company.stateCode && `, ${company.stateCode}`}
                        </Text>
                      )}
                      {company.phone && (
                        <Text fontSize="sm" color="fg.muted">
                          Phone: {company.phone}
                        </Text>
                      )}
                    </VStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Two Column Layout */}
        <Flex direction={{ base: 'column', md: 'row' }} gap="6" align="stretch">
          {/* Pending Purchase Orders */}
          <Card.Root flex="1">
            <Card.Header>
              <Heading size="md">Pending Purchase Orders</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap="4" align="stretch">
                {mockPendingOrders.map((order) => (
                  <HStack key={order.id} justify="space-between" p="3" borderWidth="1px" rounded="md">
                    <VStack align="start" gap="1">
                      <Text fontWeight="semibold">{order.id}</Text>
                      <Text fontSize="sm" color="fg.muted">{order.partyName}</Text>
                      <Text fontSize="sm" color="fg.muted">{order.date}</Text>
                    </VStack>
                    <VStack align="end" gap="1">
                      <Text fontWeight="semibold" color="#ed5d43">{order.total}</Text>
                      <Text fontSize="sm" color="orange.500">{order.status}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Quick Actions */}
          <Card.Root flexShrink={0} w={{ base: 'full', md: '320px' }}>
            <Card.Header>
              <Heading size="md">Quick Actions</Heading>
            </Card.Header>
            <Card.Body>
              <VStack gap="4" align="stretch">
                <Button
                  colorScheme="orange"
                  variant="solid"
                  size="lg"
                  w="full"
                  justifyContent="flex-start"
                  gap="3"
                  _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <Icon as={LuPlus} boxSize="5" />
                  Create New Purchase Order
                </Button>

                <Button
                  colorScheme="blue"
                  variant="outline"
                  size="lg"
                  w="full"
                  justifyContent="flex-start"
                  gap="3"
                  _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <Icon as={LuUsers} boxSize="5" />
                  Create Party
                </Button>

                <Button
                  colorScheme="gray"
                  variant="outline"
                  size="lg"
                  w="full"
                  justifyContent="flex-start"
                  gap="3"
                  _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
                  transition="all 0.2s"
                >
                  <Icon as={LuSettings} boxSize="5" />
                  Settings
                </Button>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Flex>
      </VStack>
    </Box>
  );
};

export default DashboardPage;