'use client';

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { LuBuilding, LuPlus, LuPencil } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) throw new Error('Failed to fetch companies');
        const { data } = await response.json();
        setCompanies(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <Box p="6" maxW="7xl" mx="auto">
        <VStack gap="8" align="stretch">
          <Flex align="center" justify="space-between" wrap="wrap" gap="4">
            <Skeleton height="32px" width="150px" />
            <Skeleton height="40px" width="140px" />
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height="180px" />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p="6" maxW="7xl" mx="auto">
      <VStack gap="8" align="stretch">
        <Flex align="center" justify="space-between" wrap="wrap" gap="4">
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
      </VStack>
    </Box>
  );
};

export default CompaniesPage;
