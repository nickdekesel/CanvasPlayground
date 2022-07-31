type OptionalString = string | undefined | null | false;

export function combineClasses(...arguments_: OptionalString[]): string {
  return arguments_.filter(Boolean).join(" ");
}
