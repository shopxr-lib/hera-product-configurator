import { Button, Container, Paper, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useParams } from 'react-router';
import { zodResolver } from '@mantine/form';
import { z } from 'zod';
import { useAuth } from '../../lib/hooks/useAuth';

const newPasswordSchema = z.object({
  newPassword: z.string().min(6, { message: 'Password should include at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password should include at least 6 characters' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const { useResetPasswordMutation } = useAuth();
  
  const form = useForm({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validate: zodResolver(newPasswordSchema),
  });

  const handleResetPassword = async (values: { newPassword: string }) => {
    if (token) {
      await useResetPasswordMutation.mutate({ reset_token: token, new_password: values.newPassword });
    }
  };

  return (
    <Container size={600} className="flex flex-col min-h-screen items-center justify-center">
      <Title ta="center">Reset your password</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your new password below.
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" w={'100%'}>
        <form onSubmit={form.onSubmit(handleResetPassword)}>
          <Stack>
            <PasswordInput
              required
              label="New Password"
              placeholder="Your new password"
              value={form.values.newPassword}
              onChange={(event) => form.setFieldValue('newPassword', event.currentTarget.value)}
              error={form.errors.newPassword}
              radius="md"
            />
            <PasswordInput
              required
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={form.values.confirmPassword}
              onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
              error={form.errors.confirmPassword}
              radius="md"
            />
          </Stack>

          <Button 
            loading={useResetPasswordMutation.status === 'pending'} 
            type="submit" radius="xl" fullWidth mt="xl">
            Reset Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
