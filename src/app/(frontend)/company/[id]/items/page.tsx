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

type Item = {
  id: string;
  companyId: string;
  partyId: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  unit: string | null;
  hsnCode: string | null;
  basePrice: number;
  gstRate: number;
  createdAt: string;
  updatedAt: string;
};

const ItemsPage = () => {
  const params = useParams();
  const companyId = params.id as string;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/company/${companyId}/items`);
        if (!response.ok) throw new Error('Failed to fetch items');
        const { data } = await response.json();
        setItems(data);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchItems();
    }
  }, [companyId]);

  if (loading) {
    return (
      <Box p="6" maxW="7xl" mx="auto">
        <Heading size="lg">Loading items...</Heading>
      </Box>
    );
  }

  return (
    <Box p="6" maxW="7xl" mx="auto">
      <VStack gap="8" align="stretch">
        <Flex align="center" justify="space-between" wrap="wrap" gap="4">
          <Heading size="lg" color="#ed5d43">
            Manage Items
          </Heading>
          <Button asChild colorScheme="orange" variant="solid">
            <Link href={`/company/${companyId}/items/create`}>
              <Flex align="center" gap="2">
                <Icon as={LuPlus} boxSize="5" />
                Add New Item
              </Flex>
            </Link>
          </Button>
        </Flex>

        <Box border="1px" borderColor="gray.200" borderRadius="md" overflow="hidden">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>SKU</Table.ColumnHeader>
                <Table.ColumnHeader>Description</Table.ColumnHeader>
                <Table.ColumnHeader>Unit</Table.ColumnHeader>
                <Table.ColumnHeader>HSN Code</Table.ColumnHeader>
                <Table.ColumnHeader>Base Price</Table.ColumnHeader>
                <Table.ColumnHeader>GST Rate</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.length > 0 ? (
                items.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell fontWeight="medium">{item.name}</Table.Cell>
                    <Table.Cell>{item.sku || 'N/A'}</Table.Cell>
                    <Table.Cell>{item.description || 'N/A'}</Table.Cell>
                    <Table.Cell>{item.unit || 'N/A'}</Table.Cell>
                    <Table.Cell>{item.hsnCode || 'N/A'}</Table.Cell>
                    <Table.Cell>₹{item.basePrice.toFixed(2)}</Table.Cell>
                    <Table.Cell>{item.gstRate}%</Table.Cell>
                    <Table.Cell>
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        colorScheme="orange"
                      >
                        <Link href={`/company/${companyId}/items/${item.id}/edit`}>
                          <Icon as={LuPencil} boxSize="4" />
                        </Link>
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={8} textAlign="center" py="8">
                    No items found. Create your first item to get started.
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

export default ItemsPage;
