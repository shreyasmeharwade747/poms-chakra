'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box } from '@chakra-ui/react';
import SupplierForm, { SupplierFormData } from '@/components/supplier/SupplierForm';

const CreateSupplierPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const handleSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/company/${companyId}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create supplier');
      }

      alert(`Supplier "${data.name}" has been created successfully!`);

      // Redirect back to suppliers list
      router.push(`/company/${companyId}/suppliers`);
    } catch (error) {
      console.error('Failed to create supplier:', error);
      alert('Failed to create supplier. Please try again or contact support if the problem persists.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/company/${companyId}/suppliers`);
  };

  return (
    <Box p="6" maxW="7xl" mx="auto">
      <SupplierForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitButtonText="Create Supplier"
        title="Create New Supplier"
      />
    </Box>
  );
};

export default CreateSupplierPage;
