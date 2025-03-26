import { NavLink, Outlet, useLocation } from "react-router";
import { AppShell, Stack, ActionIcon, Tooltip, Group, Text, Divider, Avatar, Title, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronsRight,
  IconChevronsLeft,
  IconLogout,
} from "@tabler/icons-react";
import { ROUTES } from "../../routing";
import { useAuth } from "../../lib/hooks/useAuth";

export const UserLayout = () => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const isCollapsed = !desktopOpened;
  const location = useLocation();
  const currentPage = ROUTES.find(link => link.path === location.pathname)?.label || "Unknown";
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppShell
      transitionDuration={500}
      transitionTimingFunction="ease"
      navbar={{
        width: isCollapsed ? 70 : 300,
        breakpoint: "sm",
      }}
    >

      <AppShell.Navbar
        p="md"
        h={'100vh'}
        className="flex flex-col justify-between"
      >

        <Stack gap={'sm'}>
          <Group justify="space-between">
            {!isCollapsed &&
              <Group>
                <Avatar
                  src=""
                  radius="xl"
                />

                <div style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {localStorage.getItem("name")}
                  </Text>

                  <Text c="dimmed" size="xs">
                    {localStorage.getItem("email")}
                  </Text>
                </div>
              </Group>
            }
            <ActionIcon size="lg" onClick={toggleDesktop} radius="xl" style={{ background: "transparent", color: "var(--color-brand-800)" }}>
              {isCollapsed ? <IconChevronsRight size={24} /> : <IconChevronsLeft size={24} />}
            </ActionIcon>
          </Group>

          <Divider my="sm" />

          {/* Navigation Links */}
          {ROUTES.map(({ icon, label, path }) => (
            <Tooltip label={label} position="right" disabled={!isCollapsed} key={label}>
              <NavLink
                to={path}
                className={`flex items-center mx-2 no-underline ${isCollapsed ? "justify-center" : "justify-start"}`}
                style={({ isActive }) => ({
                  color: isActive ? "var(--color-brand-800)" : "gray",
                  fontWeight: isActive ? 600 : "normal",
                })}
              >
                {({ isActive }) => (
                  <Group gap="sm">
                    <div
                      className="p-2 rounded-md"
                      style={{
                        background: isActive ? "var(--color-brand-100)" : "transparent",
                        color: isActive ? "var(--color-brand-800)" : "gray",
                      }}
                    >
                      {icon}
                    </div>
                    {!isCollapsed && <span>{label}</span>}
                  </Group>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </Stack>

        <div>
          <Divider my="sm" />

        <Tooltip label="Logout" position="right" disabled={!isCollapsed}>
          <NavLink
            to="/auth"
            onClick={handleLogout}
            className="flex items-center no-underline py-2 px-3 rounded-md"
            style={{
              color: "var(--color-brand-800)",
            }}
          >
            <Group gap="sm" c={"gray"}>
              <IconLogout size={24} color="gray" />
              {!isCollapsed && "Logout"}
            </Group>
          </NavLink>
        </Tooltip>
        </div>
      </AppShell.Navbar>

      <AppShell.Main mih={"80vh"}>
        <Container m={30}>
          <Title order={2} mb={40}>
            {currentPage}
          </Title>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
