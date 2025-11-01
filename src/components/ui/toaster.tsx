'use client';

import {
  Button,
  HStack,
  Toast,
  Toaster as ChakraToaster,
  createToaster,
} from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
});

export const Toaster = () => (
  <ChakraToaster toaster={toaster}>
    {(toast) => (
      <Toast.Root key={toast.id} type={toast.type} duration={toast.duration} closable>
        <Toast.Indicator />
        <HStack gap="3" align="start">
          <Toast.Title>{toast.title}</Toast.Title>
          <Button variant="ghost" size="xs" onClick={() => toaster.dismiss(toast.id)}>
            Close
          </Button>
        </HStack>
        {toast.description ? <Toast.Description>{toast.description}</Toast.Description> : null}
        <Toast.CloseTrigger />
      </Toast.Root>
    )}
  </ChakraToaster>
);
