import { IconBulb, IconCheckbox, IconChevronRight, IconUser } from '@tabler/icons-react';
import {
  Avatar,
  Badge,
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';
import classes from './index.module.css';
import { Outlet } from 'react-router';

const links = [
  { icon: IconBulb, label: 'Activity', notifications: 3 },
  { icon: IconCheckbox, label: 'Tasks', notifications: 4 },
  { icon: IconUser, label: 'Contacts' },
];

export function Sidebar() {  
  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  return (
    <>
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Harriette Spoonlicker
              </Text>

              <Text c="dimmed" size="xs">
                hspoonlicker@outlook.com
              </Text>
            </div>

            <IconChevronRight size={14} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </div>

      <div className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </div>
    </nav>
    <div className={classes.content}>
      <Outlet />
    </div>
    </>
  );
}