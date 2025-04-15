import { IconPencil, IconTrash, IconCheck, IconX, IconRosetteDiscountCheck, IconRosetteDiscountCheckFilled, IconRestore } from "@tabler/icons-react";
import { Action, BuyingPhase } from ".";

export const MAX_LENGTH = {
  LINK: 25,
}

export const ACTION_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  [Action.Edit]: { icon: <IconPencil />, color: "gray" },
  [Action.Delete]: { icon: <IconTrash />, color: "red" },
  [Action.Restore]: { icon: <IconRestore />, color: "teal" },
  [Action.Approve]: { icon: <IconRosetteDiscountCheck />, color: "green" },
  [Action.ResetApproval]: { icon: <IconRosetteDiscountCheckFilled />, color: "green" },
  [Action.Close]: { icon: <IconX />, color: "gray" },
  [Action.Confirm]: { icon: <IconCheck />, color: "teal" },
};

export const BUYING_PHASE: { [key: number]: BuyingPhase } = {
  0: BuyingPhase.NOT_COLLECTED,
  1: BuyingPhase.COLLECTED,
  2: BuyingPhase.RENOVATING
};
