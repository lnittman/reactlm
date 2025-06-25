// Simple syntax highlighting utility without external dependencies
export function highlight(code: string, language: string = 'javascript'): string {
  // Escape HTML entities first
  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  let highlighted = escapeHtml(code);

  // Basic syntax highlighting patterns
  interface Pattern {
    regex: RegExp;
    className: string;
    capture?: number;
  }
  
  const patterns: Record<string, Pattern[]> = {
    javascript: [
      { regex: /(\/\/.*$)/gm, className: 'comment' },
      { regex: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, className: 'string' },
      { regex: /\b(const|let|var|function|class|import|export|from|if|else|for|while|return|new|this|async|await)\b/g, className: 'keyword' },
      { regex: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
      { regex: /\b\d+(\.\d+)?\b/g, className: 'number' },
      { regex: /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, className: 'function', capture: 1 },
    ],
    html: [
      { regex: /(\/\/.*$)/gm, className: 'comment' },
      { regex: /(&lt;!--[\s\S]*?--&gt;)/g, className: 'comment' },
      { regex: /(&lt;\/?[a-zA-Z][^&]*?&gt;)/g, className: 'tag' },
      { regex: /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, className: 'string' },
    ]
  };

  const langPatterns = patterns[language] || patterns.javascript;

  langPatterns.forEach(({ regex, className, capture }) => {
    highlighted = highlighted.replace(regex, (match, ...groups) => {
      const text = capture ? groups[capture - 1] : match;
      return capture 
        ? match.replace(text, `<span class="token ${className}">${text}</span>`)
        : `<span class="token ${className}">${match}</span>`;
    });
  });

  return highlighted;
}