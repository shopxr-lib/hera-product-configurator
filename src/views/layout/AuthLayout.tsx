import {
  Anchor,
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { AuthRequest, RegisterRequest } from '../../lib/services/auth/types';
import { useAuth } from '../../lib/hooks/useAuth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password should include at least 6 characters' }),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(1, { message: 'Name is required' }),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept terms and conditions' }) }),
});

const forgotSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
});

export const AuthLayout = () => {
  const [type, toggle] = useToggle(['login', 'register', 'forgot']);
  const { useLoginMutation, useRegisterMutation, useForgotPasswordMutation } = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
      rememberMe: false,
    },
    validate: zodResolver(
      type === 'login' ? loginSchema : type === 'register' ? registerSchema : forgotSchema
    ),
  });

  const handleAuth = async (values: AuthRequest | RegisterRequest) => {
    if (type === "login") {
      await useLoginMutation.mutate({ email: values.email?.toLowerCase(), password: values.password, rememberMe: values.rememberMe } as AuthRequest);
    } else {
      await useRegisterMutation.mutate({ ...values, email: values.email?.toLowerCase(), role: "salesperson" } as RegisterRequest)
    }
  };

  const handleForgotPassword = async (email: string) => {
    await useForgotPasswordMutation.mutate({ email: email.toLowerCase() });
  };

  const handleToggle = (newType: "login" | "register" | "forgot") => {
    form.reset();
    toggle(newType);
  };

  return (
    <Container size={600} className='flex flex-col min-h-screen items-center justify-center'>
      <Title ta="center">
        {type === 'forgot' ? 'Forgot your password?' : 'Welcome back!'}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {type === 'login' && "Don't have an account? "}
        {type === 'register' && 'Already have an account? '}
        {type === 'forgot' && 'Enter your email to get a reset link '}
        {type !== 'forgot' && (
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => handleToggle(type === "login" ? "register" : "login")}
            size="sm"
          >
            {type === 'register' ? 'Login' : 'Register'}
          </Anchor>
        )}
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleAuth)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="you@shopxr.org"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            {type !== 'forgot' && (
              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && 'Password should include at least 6 characters'}
                radius="md"
              />
            )}

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          {type === 'login' && (
            <Group justify="space-between" mt="lg">
              <Checkbox 
                label="Remember me" 
                checked={form.values.rememberMe}
                onChange={(event) => form.setFieldValue('rememberMe', event.currentTarget.checked)}
              />
              <Anchor
                component="button"
                size="sm"
                onClick={() => handleToggle("forgot")}
              >
                Forgot password?
              </Anchor>
            </Group>
          )}

          {type === 'forgot' 
            ? <Group justify="space-between" mt="lg">
                <Anchor c="dimmed" size="sm" onClick={() => handleToggle("login")}>
                  <Center inline>
                    <IconArrowLeft size={12} stroke={1.5} />
                    <Box ml={5}>Back to the login page</Box>
                  </Center>
                </Anchor>
                <Button 
                  type="button" 
                  loading={useForgotPasswordMutation.status === 'pending'}
                  onClick={() => handleForgotPassword(form.values.email)}>
                  Reset password
                </Button>
              </Group>
            : <Button loading={type === "login" 
                ? useLoginMutation.status === 'pending'
                : useRegisterMutation.status === 'pending'
              } type="submit" radius="xl" fullWidth mt="xl">
                {upperFirst(type)}
              </Button>
          }
        </form>
      </Paper>
    </Container>
  );
};
