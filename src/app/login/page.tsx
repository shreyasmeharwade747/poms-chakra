'use client';

import { FormEvent, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import {
  Box,
  Card,
  Container,
  Field,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { LuArrowRight } from 'react-icons/lu';

import { Button } from '@/components/ui/button';
import { useColorModeValue } from '@/components/ui/color-mode';
import { ColorModeButton } from '@/components/ui/color-mode';

const LoginPage = () => {
  const router = useRouter();
  const accentColor = '#ed5d43';
  const cardBg = useColorModeValue('rgba(255,255,255,0.82)', 'rgba(12,12,12,0.7)');
  const cardBorder = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/admin',
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      const session = await getSession();
      let destination = '/';

      if ((session?.user as any)?.role === 'SUPER_ADMIN') {
        destination = '/admin';
      } else if ((session?.user as any)?.role === 'USER') {
        destination = '/dashboard';
      }

      router.push(destination);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      bgGradient="linear(to-br, rgba(237,93,67,0.14), rgba(237,93,67,0.04))"
      h="100dvh"
      minH="100vh"
      w="full"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <ColorModeButton
        aria-label="Toggle theme"
        position="fixed"
        top={{ base: '4', md: '6' }}
        right={{ base: '4', md: '6' }}
        zIndex={10}
      />
      <Container
        maxW="lg"
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={{ base: '0', md: '0' }}
        px={{ base: '4', md: '0' }}
      >
        <Stack gap={{ base: '6', md: '8' }} align="center" w="full">
          <Stack align="center" textAlign="center" px={{ base: '2', md: '0' }}>
            <Heading size="3xl" fontWeight="bold">Login</Heading>
          </Stack>

          <Card.Root
            w="full"
            bg={cardBg}
            shadow="none"
            borderWidth="0"
            rounded="xl"
            backdropFilter="auto"
            backdropBlur="18px"
          >
            <Card.Body gap="5" p={{ base: '6', md: '7' }}>
              <form onSubmit={handleSubmit}>
                <Stack gap="5">
                  <Stack gap="4">
                    <Field.Root>
                      <Field.Label fontSize="sm" textTransform="uppercase" letterSpacing="wide" fontWeight="medium">
                        Email address
                      </Field.Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        required
                        size="lg"
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label fontSize="sm" textTransform="uppercase" letterSpacing="wide" fontWeight="medium">
                        Password
                      </Field.Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        required
                        size="lg"
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                      />
                    </Field.Root>

                    <Stack direction="row" justify="flex-end">
                      <Link asChild color={accentColor} fontWeight="medium">
                        <NextLink href="/forgot-password">Forgot password?</NextLink>
                      </Link>
                    </Stack>
                  </Stack>

                  {error ? (
                    <Text color={accentColor} textStyle="sm">
                      {error}
                    </Text>
                  ) : null}

                  <Button
                    type="submit"
                    loading={isLoading}
                    bg={accentColor}
                    color="white"
                    size="lg"
                    _hover={{ bg: '#d64c35' }}
                  >
                    <HStack gap="2">
                      <Text>Sign in</Text>
                      <LuArrowRight />
                    </HStack>
                  </Button>
                </Stack>
              </form>
            </Card.Body>

            <Card.Footer
              flexDirection="column"
              gap="4"
              px={{ base: '6', md: '8' }}
              pb={{ base: '6', md: '8' }}
              pt="0"
            >
              <Box borderTopWidth="1px" borderColor={cardBorder} w="full" />
              <Text color={mutedText} textAlign="center" textStyle="sm">
                Need access?
                <Link asChild color={accentColor} fontWeight="semibold" ml="1">
                  <NextLink href="/support">Contact support</NextLink>
                </Link>
              </Text>
            </Card.Footer>
          </Card.Root>
        </Stack>
      </Container>
    </Box>
  );
}

export default LoginPage;
