import type {
  NormalizedSidebarGroup,
  SidebarDivider,
  SidebarItem,
  SidebarSectionHeader,
} from "@rspress/core";
import { normalizeHref } from "@rspress/core/runtime";

const isSidebarDivider = (
  item:
    | NormalizedSidebarGroup
    | SidebarItem
    | SidebarDivider
    | SidebarSectionHeader,
): item is SidebarDivider => "dividerType" in item;

const isSidebarSectionHeader = (
  item:
    | NormalizedSidebarGroup
    | SidebarItem
    | SidebarDivider
    | SidebarSectionHeader,
): item is SidebarSectionHeader => "sectionHeaderText" in item;

const removeIndex = (link: string) => normalizeHref(link, true);

export function findItemByRoutePath(
  items: (
    SidebarItem | NormalizedSidebarGroup | SidebarDivider | SidebarSectionHeader
  )[],
  routePath: string,
): (SidebarItem | NormalizedSidebarGroup)[] {
  const isRoutePathMatch = (
    item:
      | SidebarItem
      | NormalizedSidebarGroup
      | SidebarDivider
      | SidebarSectionHeader,
  ) => {
    if (isSidebarDivider(item) || isSidebarSectionHeader(item)) {
      return false;
    }
    const removeIndexUrl = removeIndex(item.link || "/");
    const normalizedRoutePath = routePath.replace(/\/$/, "");
    return (
      removeIndexUrl === routePath || removeIndexUrl === normalizedRoutePath
    );
  };

  const matchIndex = items.findIndex(isRoutePathMatch);

  if (matchIndex === -1) {
    return items
      .map((item) => {
        if (!("items" in item)) {
          return [];
        }
        return findItemByRoutePath(item.items, routePath);
      })
      .flat();
  }

  const match = items[matchIndex] as SidebarItem | NormalizedSidebarGroup;
  if ("items" in match && Array.isArray(match.items) && match.items.length) {
    if (match.items.every((item) => !("items" in item))) {
      return [match];
    }
    return match.items.filter((item) => !isSidebarDivider(item)) as (
      SidebarItem | NormalizedSidebarGroup
    )[];
  }

  const result = [...items];
  if (!("items" in match)) {
    result.splice(matchIndex, 1);
  }
  return result.filter((item) => !isSidebarDivider(item)) as (
    SidebarItem | NormalizedSidebarGroup
  )[];
}
