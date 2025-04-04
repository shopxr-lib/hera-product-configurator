export enum BuyingPhase {
  NOT_COLLECTED = "Haven't collected Keys",
  COLLECTED = "Collected Keys",
  RENOVATING = "Renovating Existing House"
}

export enum Role {
  Admin = "admin",
  SalesPerson = "salesperson"
}

export enum Action {
  Edit = "Edit",
  Delete = 'Delete',
  Restore = 'Restore',
  Approve = 'Approve',
  ResetApproval = 'ResetApproval',
  Close = 'Close',
  Confirm = 'Confirm',
}

export enum NotificationType {
  Success = 'success',
  Error = 'error'
}