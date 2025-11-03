'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import CompanyForm, { CompanyFormData } from '@/components/company/CompanyForm';

type CompanyData = {
  name: string;
  gstin: string;
  pan: string;
  address: string;
  stateCode: string;
  email: string;
  phone: string;
  gstType: string;
};

const CreateCompanyPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    gstin: '',
    pan: '',
    address: '',
    stateCode: '',
    email: '',
    phone: '',
    gstType: 'INTRA_STATE',
  });
  const router = useRouter();

  const handleSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    const payload = {
      name: data.name.trim(),
      gstin: data.gstin.trim() || undefined,
      pan: data.pan.trim() || undefined,
      address: data.address.trim() || undefined,
      stateCode: data.stateCode.trim() || undefined,
      email: data.email.trim() || undefined,
      phone: data.phone.trim() || undefined,
      gstType: data.gstType,
      logoUrl: undefined, // TODO: upload logoFile and supply resulting URL
    };

    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to create company');
      }

      alert('Company created successfully.');
      router.push('/companies');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create company';
      alert(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (data: CompanyFormData) => {
    setCompanyData(data);
  };

  return (
    <Box p="6" maxW="8xl" mx="auto">
      <VStack gap="6" align="stretch">
        <Box position="sticky" top="0" bg="bg" zIndex="10" py="4" borderBottomWidth="1px" borderColor="border.subtle">
          <Flex align="center" justify="space-between" wrap="wrap" gap="4" pl="4">
            <Heading size="lg" color="#ed5d43">
              Create Company
            </Heading>
            <Text color="fg.muted">Fill out the details below to register a new company.</Text>
          </Flex>
        </Box>

        <Flex direction={{ base: 'column', md: 'row' }} gap="6" align="stretch">
          {/* Form Section */}
          <Box flex="1">
            <CompanyForm
              onSubmit={handleSubmit}
              onChange={handleFormChange}
              isSubmitting={isSubmitting}
              submitButtonText="Submit"
            />
          </Box>

          {/* Summary Section */}
          <Card.Root flexShrink={0} w={{ base: 'full', md: '400px' }}>
            <Card.Header>
              <Heading size="md">Company Summary</Heading>
            </Card.Header>
            <Card.Body>
              <VStack align="stretch" gap="4">
                <Box>
                  <Text fontWeight="semibold" mb="2">Company Name</Text>
                  <Text>{companyData.name || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb="2">GSTIN</Text>
                  <Text>{companyData.gstin || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb="2">PAN</Text>
                  <Text>{companyData.pan || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb="2">Address</Text>
                  <Text>{companyData.address || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb="2">State Code</Text>
                  <Text>{companyData.stateCode || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb="2">Phone</Text>
                  <Text>{companyData.phone || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb="2">Email</Text>
                  <Text>{companyData.email || 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb="2">GST Type</Text>
                  <Text>{companyData.gstType === 'INTRA_STATE' ? 'Intra State' : companyData.gstType === 'INTER_STATE' ? 'Inter State' : 'Not specified'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb="2">Logo</Text>
                  <Text>Not uploaded</Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Flex>
      </VStack>
    </Box>
  );
};

export default CreateCompanyPage;
