import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Suggestion } from 'minisearch';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import { searchService, type EnhancedSearchResult } from '@/lib/docs/search';
import { cn } from '@/lib/utils';

interface SearchComponentProps {
  className?: string;
  placeholder?: string;
}

export function SearchComponent({
  className,
  placeholder = 'Search documentation...',
}: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<EnhancedSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const navigate = useNavigate();
  // const inputRef = useRef<HTMLInputElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (selectedIndex < 0) return;
    const el = itemRefs.current[selectedIndex];
    if (el && containerRef.current) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Search when query changes
  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        setSuggestions([]);
        return;
      }

      const searchResults = await searchService.search(query, {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 2, description: 1, headings: 1, tags: 1 },
      });
      const searchSuggestions = await searchService.suggest(query, {
        prefix: true,
        fuzzy: 0.2,
      });

      setResults(searchResults);
      setSuggestions(searchSuggestions);
    };
    search();
    setSelectedIndex(-1);
  }, [query]);

  // Handle clicks outside overlay to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (isOverlayOpen && !target.closest('[data-search-overlay]')) {
        closeSearchOverlay();
      }
    }

    if (isOverlayOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOverlayOpen]);

  // Handle keyboard shortcut (Ctrl+K) to open search overlay
  useEffect(() => {
    function handleKeyboardShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openSearchOverlay();
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () =>
      document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  const openSearchOverlay = () => {
    setIsOverlayOpen(true);
    setTimeout(() => {
      overlayInputRef.current?.focus();
    }, 100);
  };

  const closeSearchOverlay = () => {
    setIsOverlayOpen(false);
    setQuery('');
    setSelectedIndex(-1);
  };

  // Handle ESC key to close search overlay
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOverlayOpen) {
        closeSearchOverlay();
      }
    }

    if (isOverlayOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOverlayOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOverlayOpen) return;

    const totalItems = suggestions.length + results.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (selectedIndex < suggestions.length) {
            // Selected a suggestion
            setQuery(suggestions[selectedIndex].suggestion);
            overlayInputRef.current?.focus();
          } else {
            // Selected a result
            const resultIndex = selectedIndex - suggestions.length;
            handleResultClick(results[resultIndex]);
          }
        }
        break;
      case 'Escape':
        closeSearchOverlay();
        break;
    }
  };

  const handleResultClick = (result: EnhancedSearchResult) => {
    if (result.slug.startsWith('http')) {
      window.open(result.slug, '_blank');
      closeSearchOverlay();
      return;
    }
    navigate(result.slug);
    closeSearchOverlay();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    overlayInputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    overlayInputRef.current?.focus();
  };

  return (
    <>
      {/* Desktop Search - Placeholder input */}
      <div className={cn('relative hidden md:block', className)}>
        <div className="relative">
          <Search
            className="h-4 w-4 text-muted-foreground"
            onClick={openSearchOverlay}
          />
        </div>
      </div>
      {/* TODO: if we need show input area, uncomment this and remove the above code */}
      {/* <div className={cn('relative hidden max-w-[65ch] md:block', className)}> */}
      {/*   <div className="relative"> */}
      {/*     <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" /> */}
      {/*     <Input */}
      {/*       ref={inputRef} */}
      {/*       type="text" */}
      {/*       placeholder={placeholder} */}
      {/*       value="" */}
      {/*       onClick={openSearchOverlay} */}
      {/*       readOnly */}
      {/*       className="dark:shadown-none cursor-pointer rounded-none border-none bg-transparent pr-10 pl-10 shadow-none focus-visible:border-none! focus-visible:ring-0 dark:bg-transparent" */}
      {/*     /> */}
      {/*     <div className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground"> */}
      {/*       Ctrl K */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}

      {/* Mobile Search Icon */}
      <Button
        variant="ghost"
        size="icon"
        onClick={openSearchOverlay}
        className="h-9 w-9 p-0 md:hidden"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Unified Search Overlay */}
      {isOverlayOpen && (
        <div className="fixed inset-0 z-99" data-search-overlay>
          {/* Blur backdrop */}
          <div className="fixed top-0 left-0 h-screen w-full bg-black/20 backdrop-blur-lg" />

          {/* Search container */}
          <div className="relative z-10 animate-fade-in-top p-4">
            <div className="mx-auto mt-16 max-w-2xl rounded-lg border bg-background/95 shadow-lg backdrop-blur-sm">
              {/* Search input */}
              <div className="relative p-4">
                <Search className="absolute top-1/2 left-7 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={overlayInputRef}
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-none pr-10 pl-10 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-16 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSearchOverlay}
                  className="absolute top-1/2 right-4 h-7 w-7 -translate-y-1/2 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search results */}
              {(query.trim() || results.length > 0) && (
                <div
                  ref={containerRef}
                  className="max-h-80 overflow-y-auto border-t p-1"
                >
                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mb-2 border-b border-border pb-2">
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Suggestions
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          ref={(el) => {
                            itemRefs.current[index] = el;
                          }}
                          data-index={index}
                          key={`suggestion-${index}`}
                          onClick={() =>
                            handleSuggestionClick(suggestion.suggestion)
                          }
                          className={cn(
                            'w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            selectedIndex === index &&
                              'bg-accent text-accent-foreground',
                          )}
                        >
                          <Search className="mr-2 inline h-3 w-3 text-muted-foreground" />
                          {suggestion.suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Results */}
                  {results.length > 0 && (
                    <div>
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Results
                      </div>
                      {results.map((result, index) => {
                        const actualIndex = suggestions.length + index;
                        return (
                          <button
                            ref={(el) => {
                              itemRefs.current[actualIndex] = el;
                            }}
                            data-index={actualIndex}
                            key={`result-${index}`}
                            onClick={() => handleResultClick(result)}
                            className={cn(
                              'w-full rounded-sm px-2 py-2 text-left transition-colors',
                              'hover:bg-accent hover:text-accent-foreground',
                              selectedIndex === actualIndex &&
                                'bg-accent text-accent-foreground',
                            )}
                          >
                            <div className="text-sm font-medium">
                              <span className="font-semibold text-active">
                                {(result.matchedHeadings.length > 0 &&
                                  'Section: ' + result.matchedHeadings[0]) ||
                                  (result.matchedTags.length > 0 &&
                                    'Tag: ' + result.matchedTags[0]) ||
                                  (result.title.length > 0 &&
                                    'Article: ' + result.title)}
                              </span>
                            </div>
                            <div className="mt-0.5 text-xs text-foreground/75">
                              {result.description || ''}
                            </div>
                            <div className="mt-1 text-xs text-active">
                              {result.section}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* No results */}
                  {query.trim() &&
                    results.length === 0 &&
                    suggestions.length === 0 && (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No results found for "{query}"
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
