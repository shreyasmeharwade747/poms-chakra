'use client';

import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const CreateItemPage = () => {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    unit: '',
    hsnCode: '',
    basePrice: '',
    gstRate: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, just redirect back to items page
      // TODO: Implement actual item creation API call
      router.push(`/company/${companyId}/items`);
    } catch (error) {
      alert('Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box p="6" maxW="4xl" mx="auto">
      <VStack gap="6" align="stretch">
        <Flex align="center" gap="4">
          <Button asChild variant="ghost" colorScheme="orange">
            <Link href={`/company/${companyId}/items`}>
              ← Back to Items
            </Link>
          </Button>
          <Heading size="lg" color="#ed5d43">
            Create New Item
          </Heading>
        </Flex>

        <Card.Root>
          <Card.Header>
            <Card.Title>Item Details</Card.Title>
            <Card.Description>
              Enter the details for the new item
            </Card.Description>
          </Card.Header>

          <Card.Body>
            <form onSubmit={handleSubmit}>
              <VStack gap="4">
                <Field.Root>
                  <Field.Label>Name *</Field.Label>
                  <Input
                    placeholder="e.g., Brake Pads Set"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Description</Field.Label>
                  <Textarea
                    placeholder="Item description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                </Field.Root>

                <Flex gap="4" wrap="wrap">
                  <Field.Root flex="1" minW="200px">
                    <Field.Label>SKU</Field.Label>
                    <Input
                      placeholder="e.g., BP-001"
                      value={formData.sku}
                      onChange={(e) => handleChange('sku', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root flex="1" minW="200px">
                    <Field.Label>Unit</Field.Label>
                    <Input
                      placeholder="e.g., pcs, set, kg"
                      value={formData.unit}
                      onChange={(e) => handleChange('unit', e.target.value)}
                    />
                  </Field.Root>
                </Flex>

                <Flex gap="4" wrap="wrap">
                  <Field.Root flex="1" minW="200px">
                    <Field.Label>HSN Code</Field.Label>
                    <Input
                      placeholder="e.g., 87083000"
                      value={formData.hsnCode}
                      onChange={(e) => handleChange('hsnCode', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root flex="1" minW="200px">
                    <Field.Label>GST Rate (%)</Field.Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="18.00"
                      value={formData.gstRate}
                      onChange={(e) => handleChange('gstRate', e.target.value)}
                    />
                  </Field.Root>
                </Flex>

                <Field.Root>
                  <Field.Label>Base Price (₹)</Field.Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.basePrice}
                    onChange={(e) => handleChange('basePrice', e.target.value)}
                  />
                </Field.Root>
              </VStack>
            </form>
          </Card.Body>

          <Card.Footer>
            <Flex gap="3" justify="flex-end" w="full">
              <Button asChild variant="outline">
                <Link href={`/company/${companyId}/items`}>Cancel</Link>
              </Button>
              <Button
                type="submit"
                colorScheme="orange"
                loading={loading}
                onClick={handleSubmit}
              >
                Create Item
              </Button>
            </Flex>
          </Card.Footer>
        </Card.Root>
      </VStack>
    </Box>
  );
};

export default CreateItemPage;
