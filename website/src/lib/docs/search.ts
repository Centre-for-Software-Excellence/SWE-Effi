import MiniSearch, {
  SearchOptions,
  SearchResult,
  Suggestion,
} from 'minisearch';

type Options = SearchOptions & {
  limit?: number;
};

export type EnhancedSearchResult = SearchResult & {
  matchedHeadings: string[];
  matchedTags: string[];
};

class SearchService {
  private miniSearch: MiniSearch<any> | null;
  private initialized: boolean;

  constructor() {
    this.miniSearch = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    const index = await fetch('/search/index.json')
      .then((res) => res.text())
      .catch((err) => {
        console.error('Failed to load search index:', err);
        return null;
      });
    this.miniSearch = MiniSearch.loadJSON(index || '', {
      fields: ['title', 'description', 'headings', 'tags'],
      storeFields: [
        'slug',
        'title',
        'section',
        'tags',
        'headings',
        'description',
      ],
    });
  }

  private findMatches(query: string, items: string[]): string[] {
    if (!query || !items) return [];

    const queryTerms = query.toLowerCase().split(/\s+/);

    return items.filter((item) => {
      const itemLower = item.toLowerCase();
      return queryTerms.some(
        (term) => itemLower.includes(term) || itemLower.startsWith(term), // prefix matching
      );
    });
  }

  async search(
    query: string,
    options: Options = {
      prefix: true,
      fuzzy: 0.2,
      boost: { title: 2, description: 1, headings: 1, tags: 1 },
    },
  ): Promise<EnhancedSearchResult[]> {
    const { limit = 10, ...searchOptions } = options;

    await this.initialize();
    return this.miniSearch!.search(query, searchOptions)
      .slice(0, limit)
      .map((res) => ({
        ...res,
        matchedHeadings: this.findMatches(query, res.headings || []),
        matchedTags: this.findMatches(query, res.tags || []),
      }));
  }

  async suggest(
    query: string,
    options: Options = {
      prefix: true,
      fuzzy: 0.2,
    },
  ): Promise<Suggestion[]> {
    const { limit = 5, ...suggestionOptions } = options;
    await this.initialize();
    return this.miniSearch!.autoSuggest(query, suggestionOptions).slice(
      0,
      limit,
    );
  }
}

export const searchService = new SearchService();
