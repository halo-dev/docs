import { Link, useEditLink } from "@rspress/core/theme-original";
import MingcuteEdit3Line from "~icons/mingcute/edit-3-line";

interface EditLinkProps {
  isOutline?: boolean;
}

export function EditLink({ isOutline = false }: EditLinkProps) {
  const editLink = useEditLink();

  if (!editLink) {
    return null;
  }

  const className = isOutline
    ? "rp-outline__action-row rp-edit-link"
    : "rp-edit-link rp-edit-link--footer";

  return (
    <Link href={editLink.link} className={className}>
      <MingcuteEdit3Line aria-hidden="true" />
      <span>{editLink.text}</span>
    </Link>
  );
}
