const fileMap = [
  {
    id: 0,
    name: 'Text',
    slug: 'text',
    ext: ['txt'],
  },
  {
    id: 1,
    name: 'HTML',
    slug: 'html',
    ext: ['html', 'htm'],
  },
  {
    id: 2,
    name: 'CSS',
    slug: 'css',
    ext: ['css'],
  },
  {
    id: 3,
    name: 'JavaScript',
    slug: 'javascript',
    ext: ['js', 'jsx', 'mjs'],
  },
  {
    id: 4,
    name: 'TypeScript',
    slug: 'typescript',
    ext: ['ts', 'tsx'],
  },
  {
    id: 5,
    name: 'Markdown',
    slug: 'markdown',
    ext: ['md'],
  },
  {
    id: 6,
    name: 'Java',
    slug: 'java',
    ext: ['java'],
  },
  {
    id: 7,
    name: 'C',
    slug: 'c',
    ext: ['c'],
  },
  {
    id: 8,
    name: 'C++',
    slug: 'cpp',
    ext: ['cpp'],
  },
  {
    id: 9,
    name: 'C#',
    slug: 'csharp',
    ext: ['csharp'],
  },
  {
    id: 10,
    name: 'Python',
    slug: 'python',
    ext: ['py'],
  },
  {
    id: 11,
    name: 'Go',
    slug: 'go',
    ext: ['go'],
  },
  {
    id: 12,
    name: 'JSON',
    slug: 'json',
    ext: ['json'],
  },
  {
    id: 13,
    name: 'YAML',
    slug: 'yaml',
    ext: ['yaml', 'yml'],
  },
  {
    id: 14,
    name: 'XML',
    slug: 'xml',
    ext: ['xml'],
  },
  {
    id: 15,
    name: 'SQL',
    slug: 'sql',
    ext: ['sql'],
  },
  {
    id: 16,
    name: 'Shell',
    slug: 'shell',
    ext: ['sh'],
  },
  {
    id: 17,
    name: 'Rust',
    slug: 'rust',
    ext: ['rs'],
  },
  {
    id: 18,
    name: 'Kotlin',
    slug: 'kotlin',
    ext: ['kt'],
  },
  {
    id: 19,
    name: 'PHP',
    slug: 'php',
    ext: ['php'],
  },
  {
    id: 20,
    name: 'Ruby',
    slug: 'ruby',
    ext: ['rb'],
  },
]

const findByExt = (ext: string): IFileMap => {
  for (let lang of fileMap) {
    if (lang.ext?.includes(ext)) {
      return lang
    }
  }
  return { id: -1, name: 'Text', slug: 'text' }
}
const findBySlug = (slug: string): IFileMap => {
  for (let lang of fileMap) {
    if (lang.slug === slug) {
      return lang
    }
  }
  return { id: -1, name: 'Text', slug: 'text' }
}

export { findByExt, findBySlug }
