import type {
  NormalizedSidebarGroup,
  SidebarDivider,
  SidebarItem,
  SidebarSectionHeader,
} from "@rspress/core";
import { isEqualPath, usePageData, useSidebar } from "@rspress/core/runtime";
import {
  FallbackHeading,
  type Group,
  type GroupItem,
  OverviewGroup,
} from "@rspress/core/theme-original";
import { useEffect, useMemo, useRef, useState } from "react";
import MingcuteSearch2Line from "~icons/mingcute/search-2-line";
import { findItemByRoutePath } from "./utils";

const normalizeText = (text: string) => text.toLowerCase().replace(/-/g, " ");

const matchesQuery = (text: string, query: string) =>
  normalizeText(text).includes(normalizeText(query));

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

const isSidebarSingleFile = (item: SidebarItem | NormalizedSidebarGroup) =>
  !Reflect.has(item, "items") && Reflect.has(item, "link");

const OverviewSearchInput = ({
  query,
  setQuery,
  searchRef,
}: {
  query: string;
  setQuery: (query: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
}) => (
  <div className="rp-overview-search">
    <div className="rp-overview-search__field">
      <input
        ref={searchRef}
        type="search"
        placeholder="搜索内容"
        aria-label="搜索内容"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="rp-overview-search__input"
      />
      <MingcuteSearch2Line
        className="rp-overview-search__icon"
        aria-hidden="true"
        focusable="false"
      />
    </div>
  </div>
);

export function Overview(props: {
  content?: React.ReactNode;
  groups?: Group[];
  overviewHeaders?: number[];
}) {
  const {
    siteData,
    page: { routePath, title, frontmatter },
  } = usePageData();
  const { content, groups: customGroups } = props;
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (frontmatter.overview === true) {
      searchRef.current?.focus();
    }
  }, []);

  const subFilter = (link: string) =>
    link.startsWith(routePath.replace(/overview$/, "")) &&
    !isEqualPath(link, routePath);

  const getChildLink = (
    traverseItem:
      | SidebarDivider
      | SidebarItem
      | NormalizedSidebarGroup
      | SidebarSectionHeader,
  ): string => {
    if ("link" in traverseItem && traverseItem.link) {
      return traverseItem.link;
    }
    if ("items" in traverseItem) {
      return getChildLink(traverseItem.items[0]);
    }
    return "";
  };

  const { pages } = siteData;
  const overviewModules = pages.filter((page) => subFilter(page.routePath));
  let overviewSidebarGroups = useSidebar() as (
    NormalizedSidebarGroup | SidebarItem
  )[];

  if (overviewSidebarGroups[0]?.link !== routePath) {
    overviewSidebarGroups = findItemByRoutePath(
      overviewSidebarGroups,
      routePath,
    );
  }

  function normalizeSidebarItem(
    item:
      | SidebarItem
      | SidebarDivider
      | NormalizedSidebarGroup
      | SidebarSectionHeader,
    sidebarGroup?: NormalizedSidebarGroup,
    itemFrontmatter?: Record<string, unknown>,
  ): GroupItem | false {
    if (isSidebarDivider(item) || isSidebarSectionHeader(item)) {
      return false;
    }
    if (
      item.link === `${routePath}index` &&
      itemFrontmatter?.overview === true
    ) {
      return false;
    }
    const overviewHeaders = props.overviewHeaders ??
      item.overviewHeaders ??
      (itemFrontmatter?.overviewHeaders as number[]) ??
      sidebarGroup?.overviewHeaders ?? [2];
    const pageModule = overviewModules.find((module) =>
      isEqualPath(module.routePath, item.link || ""),
    );
    return {
      text: item.text,
      link: getChildLink(item),
      headers:
        pageModule?.toc?.filter((header) =>
          overviewHeaders.some((depth) => header.depth === depth),
        ) || [],
    };
  }

  const groups =
    customGroups ??
    useMemo(() => {
      return overviewSidebarGroups
        .filter((normalizedSidebarGroup) => {
          const sidebarGroup = normalizedSidebarGroup as NormalizedSidebarGroup;
          if (Array.isArray(sidebarGroup.items)) {
            return (
              sidebarGroup.items.filter((item) => subFilter(getChildLink(item)))
                .length > 0
            );
          }
          return (
            isSidebarSingleFile(sidebarGroup) &&
            subFilter(getChildLink(sidebarGroup))
          );
        })
        .map((normalizedSidebarGroup) => {
          const sidebarGroup = normalizedSidebarGroup as NormalizedSidebarGroup;
          let items: GroupItem[] = [];
          if (sidebarGroup.items) {
            items = sidebarGroup.items
              .map((item) =>
                normalizeSidebarItem(item, sidebarGroup, frontmatter),
              )
              .filter(Boolean) as GroupItem[];
          } else if (isSidebarSingleFile(sidebarGroup)) {
            items = [
              normalizeSidebarItem(
                {
                  link: sidebarGroup.link,
                  text: sidebarGroup.text || "",
                  tag: sidebarGroup.tag,
                  _fileKey: sidebarGroup._fileKey,
                  overviewHeaders: sidebarGroup.overviewHeaders,
                } as SidebarItem,
                undefined,
                frontmatter,
              ) as GroupItem,
            ];
          }
          return {
            name: sidebarGroup.text || "",
            items,
          };
        }) as Group[];
    }, [overviewSidebarGroups, routePath, frontmatter]);

  const filtered = useMemo(() => {
    if (!query) {
      return groups;
    }
    return groups
      .map((group) => {
        if (matchesQuery(group.name, query)) {
          return group;
        }
        const matchedItems = group.items
          .map((item) => {
            if (matchesQuery(item.text || "", query)) {
              return item;
            }
            const matchedHeaders = item.headers?.filter(({ text }) =>
              matchesQuery(text, query),
            );
            return matchedHeaders?.length
              ? { ...item, headers: matchedHeaders }
              : null;
          })
          .filter(Boolean) as GroupItem[];
        return matchedItems.length ? { ...group, items: matchedItems } : null;
      })
      .filter(Boolean) as Group[];
  }, [groups, query]);

  const overviewTitle = title || "Overview";

  const isSsgMarkdown = (
    import.meta as ImportMeta & { env: { SSG_MD?: boolean } }
  ).env.SSG_MD;

  if (isSsgMarkdown) {
    return (
      <>
        <FallbackHeading level={1} title={overviewTitle} />
        {groups.map((group) => (
          <OverviewGroup key={group.name} group={group} />
        ))}
      </>
    );
  }

  return (
    <div className="rspress-doc rp-doc rspress-overview rp-overview">
      <FallbackHeading level={1} title={overviewTitle} />
      <OverviewSearchInput
        query={query}
        setQuery={setQuery}
        searchRef={searchRef}
      />
      {content}
      {filtered.length > 0 ? (
        filtered.map((group) => (
          <OverviewGroup key={group.name} group={group} />
        ))
      ) : (
        <div className="rp-overview__empty">未找到匹配的内容：{query}</div>
      )}
    </div>
  );
}
