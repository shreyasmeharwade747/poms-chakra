'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Drawer,
  Field,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  NativeSelect,
  Portal,
  Spinner,
  Table,
  Text,
} from '@chakra-ui/react';
import { LuCircleAlert } from 'react-icons/lu';

const PAGE_SIZE_OPTIONS = [10, 20, 30];

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'USER' | 'EMPLOYEE';
  isActive: boolean;
  createdAt: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UsersResponse {
  data: UserItem[];
  pagination: PaginationMeta;
}

const roleLabelMap: Record<UserItem['role'], string> = {
  SUPER_ADMIN: 'Super Admin',
  USER: 'User',
  EMPLOYEE: 'Employee',
};

const roleColorMap: Record<UserItem['role'], string> = {
  SUPER_ADMIN: '#ed5d43',
  USER: 'blue.500',
  EMPLOYEE: 'purple.300',
};

const formatter = new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const initialPagination: PaginationMeta = {
  page: 1,
  pageSize: PAGE_SIZE_OPTIONS[0],
  totalCount: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const fetchUsers = async (page: number, pageSize: number) => {
  const response = await fetch(`/api/admin/users?page=${page}&pageSize=${pageSize}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load users');
  }

  return (await response.json()) as UsersResponse;
};

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as UserItem['role'],
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = useCallback(
    async (nextPage: number, nextPageSize: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchUsers(nextPage, nextPageSize);
        setUsers(result.data);
        setPagination(result.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadData(page, pageSize).catch(() => {
      /* handled in loadData */
    });
  }, [loadData, page, pageSize]);

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSize = Number(event.target.value);
    setPageSize(nextSize);
    setPage(1);
  };

  const goToPrevious = () => {
    if (!pagination.hasPreviousPage) return;
    const nextPage = Math.max(1, page - 1);
    setPage(nextPage);
  };

  const goToNext = () => {
    if (!pagination.hasNextPage) return;
    const nextPage = Math.min(pagination.totalPages, page + 1);
    setPage(nextPage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      // Success, refresh data
      await loadData(page, pageSize);
      setIsDrawerOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER',
        isActive: true,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showingRange = useMemo(() => {
    if (users.length === 0) {
      return 'Showing 0 of 0';
    }

    const start = (pagination.page - 1) * pagination.pageSize + 1;
    const end = start + users.length - 1;
    return `Showing ${start}-${end} of ${pagination.totalCount}`;
  }, [pagination.page, pagination.pageSize, pagination.totalCount, users.length]);

  return (
    <Flex direction="column" gap={{ base: '6', md: '8' }}>
      <Box px={{ base: '4', md: '6' }}>
        <Heading size="2xl" mb={2} mt={4}>User Management</Heading>
        <Text color="fg.muted" mt="2" maxW="2xl">
          Review Users, activate or deactivate access, and monitor role assignments.
        </Text>
      </Box>

      <Flex 
        justify="space-between" 
        gap="4" 
        align={{ base: 'stretch', md: 'center' }} 
        direction={{ base: 'column', md: 'row' }}
        px={{ base: '4', md: '6' }}
      >
        <Text fontSize="sm" color="fg.muted">
          {showingRange}
        </Text>

        <HStack gap="2" alignItems="center">
          <Button
            backgroundColor="#ed5d43"
            color="white"
            size="sm"
            onClick={() => setIsDrawerOpen(true)}
            _hover={{ bg: '#d84f37' }}
          >
            Add User
          </Button>
          <Text fontSize="sm" color="fg.muted">
            Rows per page
          </Text>
          <NativeSelect.Root size="sm" maxW="24">
            <NativeSelect.Field value={String(pageSize)} onChange={handlePageSizeChange}>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </HStack>
      </Flex>

      <Table.ScrollArea 
        px={{ base: '4', md: '6' }}
        _hover={{
          '&::-webkit-scrollbar-thumb': {
            bg: 'gray.300',
          },
        }}
      >
        <Table.Root 
          size="sm" 
          variant="line" 
          striped 
          interactive
          borderWidth="2px" 
          borderColor="border.muted " 
          rounded="lg" 
          bg="bg.panel"
          p="4"
        >
          <Table.Header bg="blackAlpha.50">
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Email</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Created</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {!isLoading && users.length === 0 && !error ? (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Flex direction="column" align="center" py="10" gap="2">
                    <Icon as={LuCircleAlert} boxSize="6" color="fg.muted" />
                    <Text fontWeight="medium">No users found</Text>
                    <Text fontSize="sm" color="fg.muted">
                      Invite or create new team members to collaborate on purchase orders.
                    </Text>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : null}

            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Flex justify="center" py="10">
                    <Spinner color="#ed5d43" />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ) : null}

            {!isLoading && users.length > 0
              ? users.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>
                      <Flex direction="column">
                        <Text fontWeight="semibold">{user.name}</Text>
                        <Text fontSize="sm" color="fg.muted">
                          {user.email}
                        </Text>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell display={{ base: 'none', md: 'table-cell' }}>{user.email}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorScheme={roleColorMap[user.role] === '#ed5d43' ? undefined : roleColorMap[user.role]}
                        bg={roleColorMap[user.role]}
                        color={roleColorMap[user.role] === '#ed5d43' || user.role === 'USER' ? 'white' : undefined}
                        px="3"
                        py="1"
                        rounded="full"
                        fontSize="xs"
                        textTransform="none"
                      >
                        {roleLabelMap[user.role]}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorScheme={user.isActive ? 'green' : 'gray'}
                        variant={user.isActive ? 'subtle' : 'outline'}
                        px="3"
                        py="1"
                        rounded="full"
                        fontSize="xs"
                        textTransform="none"
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{formatter.format(new Date(user.createdAt))}</Table.Cell>
                  </Table.Row>
                ))
              : null}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {error ? (
        <Flex align="center" gap="2" bg="red.50" borderWidth="1px" borderColor="red.200" color="red.700" px="4" py="3" rounded="md">
          <Icon as={LuCircleAlert} />
          <Text fontSize="sm">{error}</Text>
        </Flex>
      ) : null}

      <Flex justify="space-between" align="center" px={{ base: '4', md: '6' }}>
        <Text fontSize="sm" color="fg.muted">
          Page {pagination.page} of {pagination.totalPages}
        </Text>
        <HStack gap="2">
          <Button
            variant="outline"
            borderColor="#ed5d43"
            color="#ed5d43"
            size="sm"
            onClick={goToPrevious}
            disabled={!pagination.hasPreviousPage || isLoading}
          >
            Previous
          </Button>
          <Button
            backgroundColor="#ed5d43"
            color="white"
            size="sm"
            onClick={goToNext}
            disabled={!pagination.hasNextPage || isLoading}
            _hover={{ bg: '#d84f37' }}
          >
            Next
          </Button>
        </HStack>
      </Flex>

      <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)}>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Add New User</Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <CloseButton />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body>
                <form onSubmit={handleSubmit}>
                  <Field.Root mb="4">
                    <Field.Label>Name</Field.Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </Field.Root>
                  <Field.Root mb="4">
                    <Field.Label>Email</Field.Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Field.Root>
                  <Field.Root mb="4">
                    <Field.Label>Password</Field.Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </Field.Root>
                  <Field.Root mb="4">
                    <Field.Label>Role</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserItem['role'] })}
                      >
                        <option value="SUPER_ADMIN">Super Admin</option>
                        <option value="USER">User</option>
                        <option value="EMPLOYEE">Employee</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </Field.Root>
                  <Field.Root mb="4">
                    <Checkbox.Root
                      checked={formData.isActive}
                      onCheckedChange={(e) => setFormData({ ...formData, isActive: !!e.checked })}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>Active</Checkbox.Label>
                    </Checkbox.Root>
                  </Field.Root>
                  {formError && (
                    <Text color="red.500" mb="4">{formError}</Text>
                  )}
                  <Button
                    type="submit"
                    backgroundColor="#ed5d43"
                    color="white"
                    loading={isSubmitting}
                    loadingText="Creating..."
                    _hover={{ bg: '#d84f37' }}
                  >
                    Create User
                  </Button>
                </form>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Flex>
  );
};

export default AdminUserManagementPage;
