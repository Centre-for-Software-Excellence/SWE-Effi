import { generateTitleFromFilename } from '../utils';

export interface DocItem {
  title: string;
  slug: string;
  path: string;
  content?: string;
}

export interface DocSection {
  title: string;
  slug: string;
  items: DocItem[];
}

// All docs files
const mdxFiles = import.meta.glob('/src/docs/**/*.mdx', {
  query: '?raw',
  import: 'default',
});
const tsxFiles = import.meta.glob('/src/docs/**/*.tsx');

export function getDocsStructure(): DocSection[] {
  const sections: { [key: string]: DocSection } = {};

  Object.keys(tsxFiles).forEach((filepath) => {
    const pathParts = filepath.replace('/src/docs/', '').split('/');
    const filename = pathParts[pathParts.length - 1];

    // Skip index files for section creation and hide files starting with '_'
    if (
      filename === 'index.tsx' ||
      filename.startsWith('_') ||
      filename.startsWith('-')
    )
      return;

    const sectionSlug = pathParts.length > 1 ? pathParts[0] : 'general';
    const sectionTitle =
      sectionSlug.charAt(0).toUpperCase() + sectionSlug.slice(1);

    if (!sections[sectionSlug]) {
      sections[sectionSlug] = {
        title: sectionTitle,
        slug: sectionSlug,
        items: [],
      };
    }

    const docSlug = filename.replace('.tsx', '');
    const docPath =
      pathParts.length > 1
        ? `/${pathParts.slice(0, -1).join('/')}/${docSlug}`
        : `/${docSlug}`;

    sections[sectionSlug].items.push({
      title: generateTitleFromFilename(filename),
      slug: docSlug,
      path: docPath,
    });
  });

  Object.keys(mdxFiles).forEach((filepath) => {
    const pathParts = filepath.replace('/src/docs/', '').split('/');
    const filename = pathParts[pathParts.length - 1];

    // Skip index files for section creation and hide files starting with '_'
    if (
      filename === 'index.tsx' ||
      filename.startsWith('_') ||
      filename.startsWith('-')
    )
      return;

    const sectionSlug = pathParts.length > 1 ? pathParts[0] : 'general';
    const sectionTitle =
      sectionSlug.charAt(0).toUpperCase() + sectionSlug.slice(1);

    if (!sections[sectionSlug]) {
      sections[sectionSlug] = {
        title: sectionTitle,
        slug: sectionSlug,
        items: [],
      };
    }

    const docSlug = filename.replace('.mdx', '');
    const docPath =
      pathParts.length > 1
        ? `/${pathParts.slice(0, -1).join('/')}/${docSlug}`
        : `/${docSlug}`;

    sections[sectionSlug].items.push({
      title: generateTitleFromFilename(filename),
      slug: docSlug,
      path: docPath,
    });
  });

  return Object.values(sections);
}

// Helper function to get all docs in a flat structure
export function getAllDocs(): DocItem[] {
  return getDocsStructure().flatMap((section) => section.items);
}

// Helper function to find a specific doc by path
export function getDocByPath(path: string): DocItem | undefined {
  return getAllDocs().find((doc) => doc.path === path);
}
