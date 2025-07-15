import { Permission } from "xrpl";

export function parsePermissions(permissions: Permission[]): string[] {
  if (!permissions) {
    return [];
  }

  return permissions.map((perm) => perm.Permission.PermissionValue).sort();
}
