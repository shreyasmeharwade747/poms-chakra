'use client';

import { useState, useEffect } from 'react';
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
  logoUrl?: string;
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const EditCompanyPage = ({ params }: PageProps) => {
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
  const [initialData, setInitialData] = useState<Partial<CompanyData>>({});
  const router = useRouter();

  // Async params handling
  useEffect(() => {
    const fetchCompanyData = async () => {
      const resolvedParams = await params;
      const companyId = resolvedParams.id;

      if (companyId) {
        try {
          const response = await fetch(`/api/companies?id=${companyId}`);
          if (!response.ok) throw new Error('Failed to fetch company');
          const { data } = await response.json();
          
          // API returns array but we expect single company for editing
          const company = Array.isArray(data) ? data[0] : data;
          if (!company) throw new Error('Company not found');
          
          const dataToSet = {
            name: company.name || '',
            gstin: company.gstin || '',
            pan: company.pan || '',
            address: company.address || '',
            stateCode: company.stateCode || '',
            email: company.email || '',
            phone: company.phone || '',
            gstType: company.gstType || 'INTRA_STATE',
            logoUrl: company.logoUrl
          };
          setCompanyData(dataToSet);
          setInitialData(dataToSet);
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Failed to load company');
          router.push('/companies');
        }
      }
    };

    fetchCompanyData();
  }, []);

  const handleSubmit = async (data: CompanyFormData) => {
    const resolvedParams = await params;
    const companyId = resolvedParams.id;
    
    if (!companyId) return;
    
    setIsSubmitting(true);
    const payload = {
      ...data,
      logoUrl: companyData.logoUrl || ''
    };

    console.log('Sending payload to update company:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`/api/companies?id=${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update company');
      
      alert('Company updated successfully');
      router.push('/companies');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Update failed');
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
              Edit Company
            </Heading>
            <Text color="fg.muted">Update the details below for {companyData.name}</Text>
          </Flex>
        </Box>

        <Flex direction={{ base: 'column', md: 'row' }} gap="6" align="stretch">
          {/* Form Section */}
          <Box flex="1">
            <CompanyForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onChange={handleFormChange}
              isSubmitting={isSubmitting}
              submitButtonText="Update Company"
              title="Edit Company Details"
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
                  <Text>{companyData.logoUrl || 'Not uploaded'}</Text>
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Flex>
      </VStack>
    </Box>
  );
};

export default EditCompanyPage;
