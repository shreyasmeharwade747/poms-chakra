'use client';

import {
  Alert,
  Box,
  Center,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ItemForm, { ItemFormData } from '@/components/item/ItemForm';

const EditItemPage = () => {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const itemId = params.itemId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [initialData, setInitialData] = useState<ItemFormData | null>(null);
  const [itemError, setItemError] = useState<string | null>(null);
  const [supplierError, setSupplierError] = useState<string | null>(null);

  const loadSuppliers = useCallback(async () => {
    if (!companyId) return;

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
    }
  }, [companyId]);

  const loadItem = useCallback(async () => {
    if (!companyId || !itemId) return;

    try {
      const response = await fetch(`/api/company/${companyId}/items/${itemId}`);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error ?? 'Failed to fetch item');
      }

      const { data } = await response.json();
      if (!data) {
        throw new Error('Item not found');
      }

      const mapped: ItemFormData = {
        name: data.name ?? '',
        description: data.description ?? '',
        sku: data.sku ?? '',
        unit: data.unit ?? '',
        hsnCode: data.hsnCode ?? '',
        basePrice: typeof data.basePrice === 'number' ? data.basePrice.toFixed(2) : `${data.basePrice ?? ''}`,
        gstRate: typeof data.gstRate === 'number' ? data.gstRate.toFixed(2) : `${data.gstRate ?? ''}`,
        partyId: data.partyId ?? '',
      };

      setInitialData(mapped);
      setItemError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load item';
      setItemError(message);
      setInitialData(null);
    }
  }, [companyId, itemId]);

  useEffect(() => {
    const loadData = async () => {
      if (!companyId || !itemId) return;

      setIsLoading(true);
      await Promise.all([loadItem(), loadSuppliers()]);
      setIsLoading(false);
    };

    loadData();
  }, [companyId, itemId, loadItem, loadSuppliers]);

  const handleSubmit = async (data: ItemFormData) => {
    if (!companyId || !itemId) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/company/${companyId}/items/${itemId}`, {
        method: 'PATCH',
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
        throw new Error(errorBody.error ?? 'Failed to update item');
      }

      const payload = await response.json();
      alert(`Item "${payload.data?.name ?? data.name}" updated successfully.`);
      router.push(`/company/${companyId}/items`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update item';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/company/${companyId}/items`);
  };

  if (isLoading) {
    return (
      <Center p="12">
        <Spinner size="lg" color="#ed5d43" />
      </Center>
    );
  }

  return (
    <Box p="6" maxW="7xl" mx="auto">
      <VStack gap="6" align="stretch">
        {itemError && (
          <Alert.Root status="error" borderRadius="md" alignItems="flex-start">
            <Alert.Indicator />
            <Alert.Description>{itemError}</Alert.Description>
          </Alert.Root>
        )}

        {supplierError && (
          <Alert.Root status="error" borderRadius="md" alignItems="flex-start">
            <Alert.Indicator />
            <Alert.Description>{supplierError}</Alert.Description>
          </Alert.Root>
        )}

        {!itemError && initialData && (
          <ItemForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitButtonText="Update Item"
            title="Edit Item"
            suppliers={suppliers}
          />
        )}

        {(!initialData || itemError) && (
          <Alert.Root status="warning" borderRadius="md" alignItems="flex-start">
            <Alert.Indicator />
            <VStack align="flex-start" gap="2">
              <Alert.Description>
                Unable to load the requested item. Return to the item list and try again.
              </Alert.Description>
              <Link href={`/company/${companyId}/items`}>Back to items</Link>
            </VStack>
          </Alert.Root>
        )}
      </VStack>
    </Box>
  );
};

export default EditItemPage;
