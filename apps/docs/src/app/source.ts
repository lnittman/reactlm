// Simplified source for now - we'll enhance this later
export const getPage = (slugs: string[] | undefined) => {
  if (!slugs || slugs.length === 0) {
    return {
      data: {
        title: 'Getting Started',
        description: 'Learn how to integrate React LLM',
        exports: {
          default: () => null,
          toc: []
        }
      }
    };
  }
  return null;
};

export const getPages = () => [];

export const pageTree = [];