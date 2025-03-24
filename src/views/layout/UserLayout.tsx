import { NavLink, Outlet, useLocation } from "react-router";
import { AppShell, Stack, ActionIcon, Tooltip, Group, Text, Divider, Avatar, Title, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronsRight,
  IconChevronsLeft,
  IconLogout,
} from "@tabler/icons-react";
import { ROUTES } from "../../routing";

export const UserLayout = () => {
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const isCollapsed = !desktopOpened;
  const location = useLocation();
  const currentPage = ROUTES.find(link => link.path === location.pathname)?.label || "Unknown";

  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
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
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        }}
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
                style={({ isActive }) => ({
                  display: "flex",
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  alignItems: "center",
                  textDecoration: "none",
                  marginInline: "10px",
                  color: isActive ? "var(--color-brand-800)" : "gray",
                  fontWeight: isActive ? 600 : "normal",
                })}
              >
                {({ isActive }) => (
                  <Group gap="sm">
                    <div
                      style={{
                        background: isActive ? "var(--color-brand-100)" : "transparent",
                        color: isActive ? "var(--color-brand-800)" : "gray",
                        padding: "6px",
                        borderRadius: "6px",
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
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              padding: "8px 10px",
              borderRadius: "6px",
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
