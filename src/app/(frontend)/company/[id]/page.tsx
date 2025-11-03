'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  VStack,
  Card,
  Grid,
} from '@chakra-ui/react';
import Link from 'next/link';
import { LuPlus, LuPackage, LuTruck } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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

const CompanyDashboardPage = () => {
  const params = useParams();
  const companyId = params.id as string;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch(`/api/company/${companyId}`);
        if (!response.ok) throw new Error('Failed to fetch company');
        const { data } = await response.json();
        setCompany(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to load company');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompany();
    }
  }, [companyId]);

  if (loading) {
    return (
      <Box p="6" maxW="7xl" mx="auto">
        <Heading size="lg">Loading company...</Heading>
      </Box>
    );
  }

  if (!company) {
    return (
      <Box p="6" maxW="7xl" mx="auto">
        <Heading size="lg">Company not found</Heading>
      </Box>
    );
  }

  return (
    <Box p="6" maxW="7xl" mx="auto">
      <VStack gap="8" align="stretch">
        <Flex align="center" justify="space-between" wrap="wrap" gap="4">
          <Heading size="lg" color="#ed5d43">
            {company.name}
          </Heading>
          <Button colorScheme="orange" variant="solid">
            <Flex align="center" gap="2">
              <Icon as={LuPlus} boxSize="5" />
              Create Purchase Order
            </Flex>
          </Button>
        </Flex>

        {/* Management Links */}
        <Box>
          <Heading size="md" mb="4">Quick Actions</Heading>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
            <Link href={`/company/${companyId}/items`}>
              <Card.Root
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                cursor="pointer"
                border="1px"
                borderColor="border"
              >
                <Card.Body>
                  <VStack gap="3">
                    <Icon as={LuPackage} boxSize="8" color="#ed5d43" />
                    <Heading size="md">Manage Items</Heading>
                    <Card.Description textAlign="center">
                      Add, edit, and organize your inventory items
                    </Card.Description>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </Link>
            <Link href={`/company/${companyId}/suppliers`}>
              <Card.Root
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                cursor="pointer"
                border="1px"
                borderColor="border"
              >
                <Card.Body>
                  <VStack gap="3">
                    <Icon as={LuTruck} boxSize="8" color="#ed5d43" />
                    <Heading size="md">Manage Suppliers</Heading>
                    <Card.Description textAlign="center">
                      View and manage your supplier relationships
                    </Card.Description>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </Link>
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
};

export default CompanyDashboardPage;
