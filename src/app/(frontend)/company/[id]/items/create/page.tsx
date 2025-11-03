'use client';

import {
  Alert,
  Box,
  Center,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ItemForm, { ItemFormData } from '@/components/item/ItemForm';

const CreateItemPage = () => {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
  const [supplierError, setSupplierError] = useState<string | null>(null);

  const loadSuppliers = useCallback(async () => {
    if (!companyId) return;

    setIsLoadingSuppliers(true);
    setSupplierError(null);

    try {
      const response = await fetch(`/api/company/${companyId}/suppliers`);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error ?? 'Failed to fetch suppliers');
      }

      const { data } = await response.json();
      const supplierOptions = (data ?? []).map((supplier: { id: string; name: string }) => ({
        id: supplier.id,
        name: supplier.name,
      }));

      setSuppliers(supplierOptions);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load suppliers';
      setSupplierError(message);
    } finally {
      setIsLoadingSuppliers(false);
    }
  }, [companyId]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const handleSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/company/${companyId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          basePrice: Number.parseFloat(data.basePrice),
          gstRate: Number.parseFloat(data.gstRate),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error ?? 'Failed to create item');
      }

      const payload = await response.json();
      alert(`Item "${payload.data?.name ?? data.name}" created successfully.`);
      router.push(`/company/${companyId}/items`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create item';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/company/${companyId}/items`);
  };

  if (isLoadingSuppliers) {
    return (
      <Center p="12">
        <Spinner size="lg" color="#ed5d43" />
      </Center>
    );
  }

  return (
    <Box p="6" maxW="7xl" mx="auto">
      <VStack gap="6" align="stretch">
        {supplierError && (
          <Alert.Root status="error" borderRadius="md" alignItems="flex-start">
            <Alert.Indicator />
            <Alert.Description>{supplierError}</Alert.Description>
          </Alert.Root>
        )}

        {!supplierError && suppliers.length === 0 && (
          <Alert.Root status="warning" borderRadius="md" alignItems="flex-start">
            <Alert.Indicator />
            <VStack align="flex-start" gap="2">
              <Alert.Description>
                No suppliers found for this company. Please add a supplier before creating items so they
                can be associated correctly.
              </Alert.Description>
              <Link href={`/company/${companyId}/suppliers/create`}>
                Add a supplier in a new tab
              </Link>
            </VStack>
          </Alert.Root>
        )}

        <ItemForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitButtonText="Create Item"
          title="Create New Item"
          suppliers={suppliers}
        />
      </VStack>
    </Box>
  );
};

export default CreateItemPage;
