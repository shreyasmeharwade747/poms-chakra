'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  NativeSelect,
  Textarea,
  VStack,
} from '@chakra-ui/react';

export type CompanyFormData = {
  name: string;
  gstin: string;
  pan: string;
  address: string;
  stateCode: string;
  email: string;
  phone: string;
  gstType: string;
};

interface CompanyFormProps {
  initialData?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  title?: string;
  onChange?: (data: CompanyFormData) => void;
}

const CompanyForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Save Company',
  title = 'Company Details',
  onChange,
}: CompanyFormProps) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: initialData?.name || '',
    gstin: initialData?.gstin || '',
    pan: initialData?.pan || '',
    address: initialData?.address || '',
    stateCode: initialData?.stateCode || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    gstType: initialData?.gstType || 'INTRA_STATE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CompanyFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      onChange?.(newData);
      return newData;
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card.Root maxW="4xl" mx="auto">
      <Card.Header>
        <Heading size="lg" color="#ed5d43">
          {title}
        </Heading>
      </Card.Header>
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <VStack gap="6" align="stretch">
            <Field.Root invalid={!!errors.name}>
              <Field.Label>Company Name *</Field.Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter company name"
              />
              <Field.ErrorText>{errors.name}</Field.ErrorText>
            </Field.Root>

            <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
              <Field.Root flex="1">
                <Field.Label>GSTIN</Field.Label>
                <Input
                  value={formData.gstin}
                  onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
              </Field.Root>

              <Field.Root flex="1">
                <Field.Label>PAN</Field.Label>
                <Input
                  value={formData.pan}
                  onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
                  placeholder="AAAAA0000A"
                  maxLength={10}
                />
              </Field.Root>
            </Flex>

            <Field.Root>
              <Field.Label>Address</Field.Label>
              <Textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter complete address"
                rows={3}
              />
            </Field.Root>

            <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
              <Field.Root flex="1">
                <Field.Label>State Code</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={formData.stateCode}
                    onChange={(e) => handleInputChange('stateCode', e.target.value)}
                  >
                    <option value="">Select State</option>
                    <option value="AP">Andhra Pradesh (AP)</option>
                    <option value="AR">Arunachal Pradesh (AR)</option>
                    <option value="AS">Assam (AS)</option>
                    <option value="BR">Bihar (BR)</option>
                    <option value="CG">Chhattisgarh (CG)</option>
                    <option value="GA">Goa (GA)</option>
                    <option value="GJ">Gujarat (GJ)</option>
                    <option value="HR">Haryana (HR)</option>
                    <option value="HP">Himachal Pradesh (HP)</option>
                    <option value="JK">Jammu and Kashmir (JK)</option>
                    <option value="JH">Jharkhand (JH)</option>
                    <option value="KA">Karnataka (KA)</option>
                    <option value="KL">Kerala (KL)</option>
                    <option value="MP">Madhya Pradesh (MP)</option>
                    <option value="MH">Maharashtra (MH)</option>
                    <option value="MN">Manipur (MN)</option>
                    <option value="ML">Meghalaya (ML)</option>
                    <option value="MZ">Mizoram (MZ)</option>
                    <option value="NL">Nagaland (NL)</option>
                    <option value="OR">Odisha (OR)</option>
                    <option value="PB">Punjab (PB)</option>
                    <option value="RJ">Rajasthan (RJ)</option>
                    <option value="SK">Sikkim (SK)</option>
                    <option value="TN">Tamil Nadu (TN)</option>
                    <option value="TG">Telangana (TG)</option>
                    <option value="TR">Tripura (TR)</option>
                    <option value="UP">Uttar Pradesh (UP)</option>
                    <option value="UT">Uttarakhand (UT)</option>
                    <option value="WB">West Bengal (WB)</option>
                    <option value="AN">Andaman and Nicobar Islands (AN)</option>
                    <option value="CH">Chandigarh (CH)</option>
                    <option value="DN">Dadra and Nagar Haveli and Daman and Diu (DN)</option>
                    <option value="DD">Daman and Diu (DD)</option>
                    <option value="DL">Delhi (DL)</option>
                    <option value="JK">Jammu and Kashmir (JK)</option>
                    <option value="LA">Ladakh (LA)</option>
                    <option value="LD">Lakshadweep (LD)</option>
                    <option value="PY">Puducherry (PY)</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root flex="1">
                <Field.Label>GST Type</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={formData.gstType}
                    onChange={(e) => handleInputChange('gstType', e.target.value)}
                  >
                    <option value="INTRA_STATE">Intra State</option>
                    <option value="INTER_STATE">Inter State</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>
            </Flex>

            <Flex gap="4" direction={{ base: 'column', md: 'row' }}>
              <Field.Root flex="1" invalid={!!errors.phone}>
                <Field.Label>Phone</Field.Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
                <Field.ErrorText>{errors.phone}</Field.ErrorText>
              </Field.Root>

              <Field.Root flex="1" invalid={!!errors.email}>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
                <Field.ErrorText>{errors.email}</Field.ErrorText>
              </Field.Root>
            </Flex>

            <Flex gap="4" justify="flex-end" pt="4">
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                colorScheme="orange"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {submitButtonText}
              </Button>
            </Flex>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
};

export default CompanyForm;
