'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { LuPlus, LuPencil } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type Supplier = {
  id: string;
  name: string;
  gstin: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  stateCode: string | null;
  isRegisteredGst: boolean;
  createdAt: string;
};

const SuppliersPage = () => {
  const params = useParams();
  const companyId = params.id as string;
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`/api/company/${companyId}/suppliers`);
        if (!response.ok) throw new Error('Failed to fetch suppliers');
        const { data } = await response.json();
        setSuppliers(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to load suppliers');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchSuppliers();
    }
  }, [companyId]);

  if (loading) {
    return (
      <Box p="6" maxW="7xl" mx="auto">
        <Heading size="lg">Loading suppliers...</Heading>
      </Box>
    );
  }

  return (
    <Box p="6" maxW="7xl" mx="auto">
      <VStack gap="8" align="stretch">
        <Flex align="center" justify="space-between" wrap="wrap" gap="4">
          <Heading size="lg" color="#ed5d43">
            Manage Suppliers
          </Heading>
          <Button asChild colorScheme="orange" variant="solid">
            <Link href={`/company/${companyId}/suppliers/create`}>
              <Flex align="center" gap="2">
                <Icon as={LuPlus} boxSize="5" />
                Add New Supplier
              </Flex>
            </Link>
          </Button>
        </Flex>

        <Box border="1px" borderColor="gray.200" borderRadius="md" overflowX="auto">
          <Table.Root minWidth="max-content">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>GSTIN</Table.ColumnHeader>
                <Table.ColumnHeader>Phone</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Address</Table.ColumnHeader>
                <Table.ColumnHeader>GST Registered</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <Table.Row key={supplier.id}>
                    <Table.Cell fontWeight="medium">{supplier.name}</Table.Cell>
                    <Table.Cell>{supplier.gstin || 'N/A'}</Table.Cell>
                    <Table.Cell>{supplier.phone || 'N/A'}</Table.Cell>
                    <Table.Cell>{supplier.email || 'N/A'}</Table.Cell>
                    <Table.Cell>
                      {supplier.address ? (
                        <>
                          {supplier.address}
                          {supplier.stateCode && `, ${supplier.stateCode}`}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Box
                        as="span"
                        px="2"
                        py="1"
                        borderRadius="sm"
                        bg={supplier.isRegisteredGst ? 'green.100' : 'red.100'}
                        color={supplier.isRegisteredGst ? 'green.800' : 'red.800'}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        {supplier.isRegisteredGst ? 'Yes' : 'No'}
                      </Box>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        colorScheme="orange"
                      >
                        <Link href={`/company/${companyId}/suppliers/${supplier.id}/edit`}>
                          <Icon as={LuPencil} boxSize="4" />
                        </Link>
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={7} textAlign="center" py="8">
                    No suppliers found. Create your first supplier to get started.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Box>
      </VStack>
    </Box>
  );
};

export default SuppliersPage;
