import { valueToEstree } from 'estree-util-value-to-estree';
import Slugger from 'github-slugger';
import type { Root as MdastRoot } from 'mdast';
import { toString } from 'mdast-util-to-string';
import { define } from 'unist-util-mdx-define';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import YAML from 'yaml';

const slugs = new Slugger();

export function remarkExtractTOC() {
  const maxDepth = 6;
  return (tree: MdastRoot, file: VFile) => {
    slugs.reset();
    const headings: { value: string; id: string; level: number }[] = [];

    visit(tree, 'heading', (node) => {
      const value = toString(node, { includeImageAlt: false });
      const slug = slugs.slug(value);

      if (node.depth <= maxDepth) {
        headings.push({
          value,
          id: slug,
          level: node.depth,
        });
      }
    });

    define(tree, file, {
      headings: valueToEstree(headings, { preserveReferences: true }),
    });
  };
}

export function remarkExtractFrontmatter() {
  return (tree: MdastRoot, file: VFile) => {
    let fmData: Record<string, any> = {};

    // Check if frontmatter already exists in file.data (processed by remark-frontmatter)
    if (file.data.frontmatter) {
      fmData = file.data.frontmatter as Record<string, any>;
    } else {
      // Fallback: look for yaml nodes
      visit(tree, 'yaml', (node: any) => {
        try {
          fmData = YAML.parse(node.value);
        } catch (e) {
          console.error('Failed to parse YAML:', e);
        }
      });
    }

    define(tree, file, {
      frontmatter: valueToEstree(fmData, { preserveReferences: true }),
    });
  };
}
