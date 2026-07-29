export interface EmbedInfo {
  embedType: string;
  targetId?: string | null;
  slug?: string | null;
}

export function resolveEmbedRoute(embed: EmbedInfo): any[] | null {
  const identifier = embed.slug || embed.targetId;
  if (!identifier) return null;

  switch (embed.embedType?.toUpperCase()) {
    case 'LISTING':
      return ['/l', identifier];
    case 'BUSINESS':
      return ['/b', identifier];
    case 'TOUR':
      return ['/tours', identifier];
    case 'USER':
    case 'PEOPLE':
      return ['/u', identifier];
    case 'LOCATION':
      return ['/search']; // Locations usually filter the search
    default:
      return ['/l', identifier]; // Fallback
  }
}
