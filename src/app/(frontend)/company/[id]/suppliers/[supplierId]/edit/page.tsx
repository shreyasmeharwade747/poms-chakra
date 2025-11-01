'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box } from '@chakra-ui/react';
import SupplierForm, { SupplierFormData } from '@/components/supplier/SupplierForm';

type Supplier = {
  id: string;
  name: string;
  gstin: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  stateCode: string | null;
  isRegisteredGst: boolean;
};

const EditSupplierPage = () => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  const supplierId = params.supplierId as string;

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`/api/company/${companyId}/suppliers/${supplierId}`);
        if (!response.ok) {
          if (response.status === 404) {
            alert('Supplier not found');
            router.push(`/company/${companyId}/suppliers`);
            return;
          }
          throw new Error('Failed to fetch supplier');
        }
        const { data } = await response.json();
        setSupplier(data);
      } catch (error) {
        console.error('Failed to fetch supplier:', error);
        alert('Failed to load supplier. Please try again.');
        router.push(`/company/${companyId}/suppliers`);
      } finally {
        setLoading(false);
      }
    };

    if (companyId && supplierId) {
      fetchSupplier();
    }
  }, [companyId, supplierId, router]);

  const handleSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/company/${companyId}/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update supplier');
      }

      alert(`Supplier "${data.name}" has been updated successfully!`);

      // Redirect back to suppliers list
      router.push(`/company/${companyId}/suppliers`);
    } catch (error) {
      console.error('Failed to update supplier:', error);
      alert('Failed to update supplier. Please try again or contact support if the problem persists.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/company/${companyId}/suppliers`);
  };

  if (loading) {
    return (
      <Box p="6" maxW="7xl" mx="auto">
        <Box textAlign="center" py="8">
          Loading supplier...
        </Box>
      </Box>
    );
  }

  if (!supplier) {
    return (
      <Box p="6" maxW="7xl" mx="auto">
        <Box textAlign="center" py="8">
          Supplier not found
        </Box>
      </Box>
    );
  }

  return (
    <Box p="6" maxW="7xl" mx="auto">
      <SupplierForm
        initialData={supplier}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Update Supplier"
        title="Edit Supplier"
      />
    </Box>
  );
};

export default EditSupplierPage;
