// A <script type="application/ld+json"> for useHead. "<" is escaped so CSV text such as
// "</script>" can never close the tag early.
export function jsonLdScript(graph: Record<string, unknown>[]) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
  return {
    type: 'application/ld+json' as const,
    innerHTML: json.replace(/</g, '\\u003c'),
  }
}

export function breadcrumbs(origin: string, items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  }
}
