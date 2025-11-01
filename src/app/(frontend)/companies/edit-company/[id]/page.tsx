'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Field,
  FileUpload,
  Flex,
  Heading,
  Icon,
  Input,
  NativeSelect,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { LuUpload, LuPencil } from 'react-icons/lu';

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
  const [logoFile, setLogoFile] = useState<File | null>(null);
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
          
          setCompanyData({
            name: company.name || '',
            gstin: company.gstin || '',
            pan: company.pan || '',
            address: company.address || '',
            stateCode: company.stateCode || '',
            email: company.email || '',
            phone: company.phone || '',
            gstType: company.gstType || 'INTRA_STATE',
            logoUrl: company.logoUrl
          });
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Failed to load company');
          router.push('/companies');
        }
      }
    };

    fetchCompanyData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedParams = await params;
    const companyId = resolvedParams.id;
    
    if (!companyId) return;
    
    setIsSubmitting(true);
    const payload = {
      ...companyData,
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

  const handleInputChange = (field: keyof CompanyData, value: string) => {
    setCompanyData({ ...companyData, [field]: value });
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
          <Card.Root flex="1">
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <VStack align="stretch" gap="6">
                  {/* Basic Info */}
                  <Box>
                    <Heading size="md" mb="3" color="#ed5d43">Basic Information</Heading>
                    <VStack gap="3">
                      <Field.Root required>
                        <Field.Label>Company Name</Field.Label>
                        <Input
                          placeholder="Enter company name"
                          size="lg"
                          value={companyData.name}
                          onChange={e => handleInputChange('name', e.target.value)}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>Address</Field.Label>
                        <Textarea
                          placeholder="Office address"
                          rows={4}
                          value={companyData.address}
                          onChange={e => handleInputChange('address', e.target.value)}
                        />
                      </Field.Root>
                    </VStack>
                  </Box>

                  {/* Tax Details */}
                  <Box>
                    <Heading size="md" mb="3" color="#ed5d43">Tax Details</Heading>
                    <VStack gap="3">
                      <Field.Root>
                        <Field.Label>GSTIN</Field.Label>
                        <Input
                          placeholder="22AAAAA0000A1Z5"
                          size="lg"
                          value={companyData.gstin}
                          onChange={e => handleInputChange('gstin', e.target.value)}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>PAN</Field.Label>
                        <Input
                          placeholder="AAAAA0000A"
                          size="lg"
                          value={companyData.pan}
                          onChange={e => handleInputChange('pan', e.target.value)}
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label>GST Type</Field.Label>
                        <NativeSelect.Root size="lg">
                          <NativeSelect.Field
                            value={companyData.gstType}
                            onChange={e => handleInputChange('gstType', e.target.value)}
                          >
                            <option value="">Select GST Type</option>
                            <option value="INTRA_STATE">Intra State</option>
                            <option value="INTER_STATE">Inter State</option>
                          </NativeSelect.Field>
                          <NativeSelect.Indicator />
                        </NativeSelect.Root>
                      </Field.Root>
                    </VStack>
                  </Box>

                  {/* Contact Info */}
                  <Box>
                    <Heading size="md" mb="3" color="#ed5d43">Contact Information</Heading>
                    <VStack gap="3">
                      <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
                        <Field.Root flex="1">
                          <Field.Label>State Code</Field.Label>
                          <Input
                            placeholder="MH"
                            size="lg"
                            value={companyData.stateCode}
                            onChange={e => handleInputChange('stateCode', e.target.value)}
                          />
                        </Field.Root>
                        <Field.Root flex="1">
                          <Field.Label>Phone</Field.Label>
                          <Input
                            placeholder="+91-9876543210"
                            size="lg"
                            value={companyData.phone}
                            onChange={e => handleInputChange('phone', e.target.value)}
                          />
                        </Field.Root>
                      </Flex>
                      <Field.Root>
                        <Field.Label>Email</Field.Label>
                        <Input
                          type="email"
                          placeholder="company@email.com"
                          size="lg"
                          value={companyData.email}
                          onChange={e => handleInputChange('email', e.target.value)}
                        />
                      </Field.Root>
                    </VStack>
                  </Box>

                  {/* Logo Upload */}
                  <Box>
                    <Heading size="md" mb="3" color="#ed5d43">Company Logo</Heading>
                    <FileUpload.Root
                      accept="image/*"
                      maxFiles={1}
                      onFileChange={event => {
                        const file = event.acceptedFiles?.[0] ?? null;
                        setLogoFile(file);
                      }}
                      onFileReject={details => {
                        if (details.rejectedFiles?.length) {
                          alert(`File upload error: ${details.rejectedFiles[0]?.errors[0]?.message || 'Unknown error'}`);
                        }
                      }}
                    >
                      <FileUpload.HiddenInput />
                      <FileUpload.Dropzone>
                        <Icon fontSize="xl" color="fg.muted">
                          <LuUpload />
                        </Icon>
                        <FileUpload.DropzoneContent>
                          <Text>Drop logo here or click to browse</Text>
                          <Text fontSize="sm" color="fg.muted">PNG, JPG up to 5MB</Text>
                        </FileUpload.DropzoneContent>
                      </FileUpload.Dropzone>
                      <FileUpload.List showSize clearable />
                    </FileUpload.Root>
                  </Box>

                  <Button
                    type="submit"
                    colorScheme="orange"
                    size="lg"
                    justifyContent="center"
                    loading={isSubmitting}
                    loadingText="Updating"
                    _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
                    transition="all 0.2s"
                  >
                    Update Company
                  </Button>
                </VStack>
              </form>
            </Card.Body>
          </Card.Root>

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
                  <Text>{logoFile?.name || companyData.logoUrl || 'Not uploaded'}</Text>
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
