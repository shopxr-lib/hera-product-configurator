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
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useService } from '../../lib/hooks/useService';
import { AuthRequest, RegisterRequest } from '../../lib/services/auth';

export const AuthLayout = () => {
  const navigate = useNavigate();
  const service = useService();
  const [type, toggle] = useToggle(['login', 'register', 'forgot']);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const handleAuth = async (values: AuthRequest | RegisterRequest) => {
    setLoading(true);
    const [data, error] = type === "login" 
      ? await service.auth.login(values) 
      : await service.auth.register({ ...values, role: "salesperson" } as RegisterRequest);
    setLoading(false);
    
    if (error) {
      alert(error.message || "Something went wrong");
    } else {
      alert(`${type === "register" ? "Registration" : "Authentication"} successful!`);
      localStorage.setItem("name", data?.user.name || "");
      localStorage.setItem("email", data?.user.email || "");
      navigate('/user/home');
    }
  };

  const handleToggle = (newType: "login" | "register" | "forgot") => {
    form.reset();
    toggle(newType);
  };

  return (
    <Container size={600} my={40}>
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
              <Checkbox label="Remember me" />
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
                <Button>Reset password</Button>
              </Group>
            : <Button loading={loading} type="submit" radius="xl" fullWidth mt="xl">
                {upperFirst(type)}
              </Button>
          }
        </form>
      </Paper>
    </Container>
  );
};
