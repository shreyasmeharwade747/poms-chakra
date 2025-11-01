'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Field,
  Flex,
  Heading,
  Input,
  NativeSelect,
  Textarea,
  VStack,
} from '@chakra-ui/react';

export type SupplierFormData = {
  name: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  stateCode: string;
  isRegisteredGst: boolean;
};

interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  title?: string;
}

const SupplierForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Save Supplier',
  title = 'Supplier Details',
}: SupplierFormProps) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: initialData?.name || '',
    gstin: initialData?.gstin || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    stateCode: initialData?.stateCode || '',
    isRegisteredGst: initialData?.isRegisteredGst ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }

    // GSTIN validation
    if (formData.isRegisteredGst) {
      // GST registered suppliers MUST have GSTIN
      if (!formData.gstin?.trim()) {
        newErrors.gstin = 'GSTIN is required for GST registered suppliers';
      } else if (formData.gstin.length !== 15) {
        newErrors.gstin = 'GSTIN must be exactly 15 characters';
      } else if (!/^[0-9A-Z]{15}$/.test(formData.gstin)) {
        newErrors.gstin = 'GSTIN must contain only numbers and uppercase letters (no spaces or special characters)';
      }
    } else {
      // Non-GST registered suppliers: GSTIN optional but if provided, must be valid
      if (formData.gstin?.trim()) {
        if (formData.gstin.length !== 15) {
          newErrors.gstin = 'GSTIN must be exactly 15 characters';
        } else if (!/^[0-9A-Z]{15}$/.test(formData.gstin)) {
          newErrors.gstin = 'GSTIN must contain only numbers and uppercase letters (no spaces or special characters)';
        }
      }
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

  const handleInputChange = (field: keyof SupplierFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <Field.Label>Supplier Name *</Field.Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter supplier name"
              />
              <Field.ErrorText>{errors.name}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.gstin}>
              <Field.Label>
                GSTIN {formData.isRegisteredGst ? '*' : '(Optional)'}
              </Field.Label>
              <Input
                value={formData.gstin}
                onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
                placeholder={formData.isRegisteredGst ? "15-character GSTIN (required)" : "15-character GSTIN (optional)"}
                maxLength={15}
              />
              <Field.HelperText>
                {formData.isRegisteredGst
                  ? "GST Identification Number (15 characters, required for GST registered suppliers)"
                  : "GST Identification Number (15 characters, optional for non-GST registered suppliers)"
                }
              </Field.HelperText>
              <Field.ErrorText>{errors.gstin}</Field.ErrorText>
            </Field.Root>

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
                <Field.Label>GST Registered</Field.Label>
                <Flex align="center" gap="3" mt="2">
                  <Checkbox.Root
                    checked={formData.isRegisteredGst}
                    onCheckedChange={(checked) => handleInputChange('isRegisteredGst', checked.checked)}
                    colorScheme="orange"
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                  <Field.HelperText>
                    {formData.isRegisteredGst ? 'Registered for GST' : 'Not registered for GST'}
                  </Field.HelperText>
                </Flex>
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

export default SupplierForm;
