import { Link, Navigate } from "react-router";
import { useAuthContext } from "../../lib/hooks/useAuthContext";
import { Container, Stack, Title, Group, Button, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

export const NotFound = () => {
  const { isAuthenticated } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  
  return (
    <Container className="flex flex-col min-h-screen items-center justify-center" size="sm">
      <Stack gap={16} align="center">
        <Title order={1} c="dimmed">
          404
        </Title>
        <Title order={3}>
          Page Not Found
        </Title>
        <Text c="dimmed">
          The page you’re looking for doesn’t exist or has been moved.
        </Text>
        <Group mt="md">
          <Button
            component={Link}
            to="/user/tracking"
            leftSection={<IconArrowLeft size={16} />}
            variant="light"
          >
            Go to Home
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};