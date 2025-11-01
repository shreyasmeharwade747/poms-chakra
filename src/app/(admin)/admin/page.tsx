import { Flex, Grid, Heading, Text } from '@chakra-ui/react';

const adminStats = [
  { label: 'Open Purchase Orders', value: 18, helpText: '+3 today' },
  { label: 'Vendors Pending Approval', value: 5, helpText: 'Review needed' },
  { label: 'Invoices Flagged', value: 2, helpText: 'Action required' },
];

const quickLinks = [
  'Create Purchase Order',
  'Invite Supplier',
  'View Audit Logs',
  'Manage User Roles',
];

const AdminDashboardPage = () => {
  return (
    <Flex direction="column" gap={{ base: '10', md: '14' }} px={{ base: '6', md: '16' }} py={{ base: '12', md: '16' }}>
      <Flex direction="column" gap="3">
        <Heading size="xl">Admin control center</Heading>
        <Text color="fg.muted" maxW="3xl">
          Get a quick sense of purchasing health and dive into approvals, invoices, and supplier onboarding tasks.
        </Text>
      </Flex>

      <Grid gap="6" templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}>
        {adminStats.map((stat) => (
          <Flex
            key={stat.label}
            borderWidth="1px"
            borderColor="blackAlpha.100"
            rounded="lg"
            padding="6"
            direction="column"
            gap="2"
            _hover={{ borderColor: '#ed5d43', transform: 'translateY(-2px)' }}
            transition="all 0.2s ease"
            bg="blackAlpha.50"
          >
            <Text textTransform="uppercase" fontSize="xs" letterSpacing="widest" color="fg.muted">
              {stat.label}
            </Text>
            <Text fontSize="3xl" fontWeight="bold">
              {stat.value}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              {stat.helpText}
            </Text>
          </Flex>
        ))}
      </Grid>

      <Flex direction="column" gap="4">
        <Heading size="md">Next actions</Heading>
        <Grid gap="4" templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
          {quickLinks.map((item) => (
            <Flex
              key={item}
              borderWidth="1px"
              borderColor="blackAlpha.100"
              rounded="lg"
              padding="5"
              direction="column"
              gap="2"
              _hover={{ borderColor: '#ed5d43', bg: 'blackAlpha.50' }}
              transition="all 0.2s ease"
            >
              <Text fontWeight="semibold">{item}</Text>
              <Text color="fg.muted" fontSize="sm">
                Quickly jump into this workflow to keep purchase orders moving forward.
              </Text>
            </Flex>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default AdminDashboardPage;
