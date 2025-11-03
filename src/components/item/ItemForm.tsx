'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Combobox,
  Field,
  Flex,
  Heading,
  Input,
  Textarea,
  VStack,
  useFilter,
  useListCollection,
} from '@chakra-ui/react';

export type ItemFormData = {
  name: string;
  description?: string;
  sku?: string;
  unit?: string;
  hsnCode?: string;
  basePrice: string;
  gstRate: string;
  partyId: string;
};

interface ItemFormProps {
  initialData?: Partial<ItemFormData>;
  onSubmit: (data: ItemFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  title?: string;
  suppliers: { id: string; name: string }[];
}

type ItemFormErrors = Partial<Record<keyof ItemFormData, string>>;

const DEFAULT_FORM: ItemFormData = {
  name: '',
  description: '',
  sku: '',
  unit: '',
  hsnCode: '',
  basePrice: '',
  gstRate: '',
  partyId: '',
};

const clampDecimal = (value: string) => {
  if (!value.trim()) return value;
  const [integer, fraction] = value.split('.');
  if (!fraction) return value;
  return `${integer}.${fraction.slice(0, 2)}`;
};

const normaliseDecimal = (value?: string | number) => {
  if (value === undefined || value === null) return '';
  return typeof value === 'number' ? value.toString() : value;
};

const ItemForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Save Item',
  title = 'Item Details',
  suppliers,
}: ItemFormProps) => {
  const [formData, setFormData] = useState<ItemFormData>({
    ...DEFAULT_FORM,
    ...initialData,
    basePrice: normaliseDecimal(initialData?.basePrice),
    gstRate: normaliseDecimal(initialData?.gstRate),
    partyId: initialData?.partyId ?? DEFAULT_FORM.partyId,
  });
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const isSupplierListEmpty = suppliers.length === 0;
  const supplierOptions = useMemo(
    () => suppliers.map((supplier) => ({ label: supplier.name, value: supplier.id })),
    [suppliers],
  );
  const supplierLabelById = useMemo(() => {
    const labels = new Map<string, string>();
    supplierOptions.forEach((option) => labels.set(option.value, option.label));
    return labels;
  }, [supplierOptions]);
  const [supplierInputValue, setSupplierInputValue] = useState('');
  useEffect(() => {
    setSupplierInputValue(supplierLabelById.get(formData.partyId) ?? '');
  }, [formData.partyId, supplierLabelById]);
  const { contains } = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: supplierOptions,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
    filter: contains,
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        basePrice: normaliseDecimal(initialData.basePrice),
        gstRate: normaliseDecimal(initialData.gstRate),
        partyId: initialData.partyId ?? DEFAULT_FORM.partyId,
      }));
    }
  }, [initialData]);

  const updateField = (field: keyof ItemFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: ItemFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.basePrice.trim()) {
      newErrors.basePrice = 'Base price is required';
    } else {
      const normalised = Number.parseFloat(formData.basePrice);
      if (Number.isNaN(normalised) || normalised < 0) {
        newErrors.basePrice = 'Enter a valid non-negative amount';
      }
    }

    if (!formData.gstRate.trim()) {
      newErrors.gstRate = 'GST rate is required';
    } else {
      const gstValue = Number.parseFloat(formData.gstRate);
      if (Number.isNaN(gstValue) || gstValue < 0 || gstValue > 100) {
        newErrors.gstRate = 'Enter a GST rate between 0 and 100';
      }
    }

    if (!formData.partyId) {
      newErrors.partyId = 'Select the supplier managing this item';
    }

    if (formData.hsnCode?.trim()) {
      const digitsOnly = formData.hsnCode.replace(/\D+/g, '');
      if (digitsOnly.length < 4 || digitsOnly.length > 8) {
        newErrors.hsnCode = 'HSN code should be 4-8 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    const payload: ItemFormData = {
      ...formData,
      basePrice: clampDecimal(formData.basePrice.trim()),
      gstRate: clampDecimal(formData.gstRate.trim()),
    };

    onSubmit(payload);
  };

  return (
    <Card.Root w="full" maxW={{ base: 'full', lg: '6xl', xl: '7xl' }} mx="auto">
      <Card.Header pb={{ base: 4, md: 6 }}>
        <Heading size="lg" color="#ed5d43">
          {title}
        </Heading>
      </Card.Header>
      <Card.Body px={{ base: 6, md: 10 }}>
        <form onSubmit={handleSubmit} noValidate>
          <VStack gap={{ base: 6, md: 8 }} align="stretch">
            <Field.Root invalid={!!errors.name}>
              <Field.Label>Item Name *</Field.Label>
              <Input
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="e.g., Stainless Steel Bolt"
                autoFocus
              />
              <Field.ErrorText>{errors.name}</Field.ErrorText>
            </Field.Root>

            <Field.Root>
              <Field.Label>Description</Field.Label>
              <Textarea
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Add any specification, packaging or usage details"
                rows={3}
              />
            </Field.Root>

            <Flex gap={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }}>
              <Field.Root flex="1">
                <Field.Label>SKU</Field.Label>
                <Input
                  value={formData.sku}
                  onChange={(event) => updateField('sku', event.target.value)}
                  placeholder="Internal stock keeping unit"
                />
              </Field.Root>
              <Field.Root flex="1">
                <Field.Label>Unit of Measure</Field.Label>
                <Input
                  value={formData.unit}
                  onChange={(event) => updateField('unit', event.target.value)}
                  placeholder="e.g., pcs, kg, box"
                />
              </Field.Root>
            </Flex>

            <Flex gap={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }}>
              <Field.Root flex="1" invalid={!!errors.hsnCode}>
                <Field.Label>HSN Code</Field.Label>
                <Input
                  value={formData.hsnCode}
                  onChange={(event) => updateField('hsnCode', event.target.value)}
                  placeholder="4-8 digit harmonised code"
                />
                <Field.HelperText>Helps calculate the correct GST slabs.</Field.HelperText>
                <Field.ErrorText>{errors.hsnCode}</Field.ErrorText>
              </Field.Root>
              <Field.Root flex="1" invalid={!!errors.partyId}>
                <Field.Label>Responsible Supplier *</Field.Label>
                <Combobox.Root
                  collection={collection}
                  value={formData.partyId ? [formData.partyId] : []}
                  inputValue={supplierInputValue}
                  onValueChange={(details) => {
                    const selectedValue = details.value?.[0] ?? '';
                    const selectedLabel = supplierLabelById.get(selectedValue) ?? '';
                    setSupplierInputValue(selectedLabel);
                    updateField('partyId', selectedValue);
                    filter('');
                  }}
                  onInputValueChange={(details) => {
                    setSupplierInputValue(details.inputValue);
                    filter(details.inputValue);
                  }}
                  disabled={isSupplierListEmpty}
                  inputBehavior="autocomplete"
                  selectionBehavior="replace"
                  placeholder={isSupplierListEmpty ? 'No suppliers available' : 'Select supplier'}
                  name="partyId"
                  allowCustomValue={false}
                >
                  <Combobox.Control>
                    <Combobox.Input />
                    <Combobox.IndicatorGroup>
                      <Combobox.ClearTrigger aria-label="Clear selection" />
                      <Combobox.Trigger aria-label="Open supplier list" />
                    </Combobox.IndicatorGroup>
                  </Combobox.Control>
                  <Combobox.Positioner>
                    <Combobox.Content>
                      <Combobox.Empty>No suppliers found</Combobox.Empty>
                      {collection.items.map((item) => (
                        <Combobox.Item key={item.value} item={item}>
                          <Combobox.ItemText>{item.label}</Combobox.ItemText>
                          <Combobox.ItemIndicator />
                        </Combobox.Item>
                      ))}
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Combobox.Root>
                <Field.HelperText>
                  {isSupplierListEmpty
                    ? 'Add a supplier first to associate items for purchase orders.'
                    : 'Choose the supplier that typically provides this item.'}
                </Field.HelperText>
                <Field.ErrorText>{errors.partyId}</Field.ErrorText>
              </Field.Root>
            </Flex>

            <Flex gap={{ base: 4, md: 6 }} direction={{ base: 'column', md: 'row' }}>
              <Field.Root flex="1" invalid={!!errors.basePrice}>
                <Field.Label>Base Price (₹) *</Field.Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={formData.basePrice}
                  onChange={(event) => updateField('basePrice', event.target.value)}
                  placeholder="0.00"
                />
                <Field.HelperText>Net price before taxes and discounts.</Field.HelperText>
                <Field.ErrorText>{errors.basePrice}</Field.ErrorText>
              </Field.Root>

              <Field.Root flex="1" invalid={!!errors.gstRate}>
                <Field.Label>GST Rate (%) *</Field.Label>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.gstRate}
                  onChange={(event) => updateField('gstRate', event.target.value)}
                  placeholder="18.00"
                />
                <Field.HelperText>Choose the slab applicable to this item.</Field.HelperText>
                <Field.ErrorText>{errors.gstRate}</Field.ErrorText>
              </Field.Root>
            </Flex>
          </VStack>

          <Card.Footer mt="10" px={{ base: 6, md: 12 }}>
            <Flex gap="4" justify="flex-end" w="full">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                bg="#ed5d43"
                color="white"
                _hover={{ bg: '#d94c35' }}
                _active={{ bg: '#c34432' }}
                loading={isSubmitting}
                disabled={isSubmitting || isSupplierListEmpty}
              >
                {submitButtonText}
              </Button>
            </Flex>
          </Card.Footer>
        </form>
      </Card.Body>
    </Card.Root>
  );
};

export default ItemForm;
