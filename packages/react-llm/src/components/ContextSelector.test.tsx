import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/preact';
import { ContextSelector } from './ContextSelector';

describe('ContextSelector', () => {
  const mockOnSelect = vi.fn();
  const defaultProps = {
    onSelect: mockOnSelect,
    position: { x: 100, y: 200 },
    searchTerm: ''
  };

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('should render all context options by default', () => {
    render(<ContextSelector {...defaultProps} />);
    
    expect(screen.getByText('@console')).toBeInTheDocument();
    expect(screen.getByText('@errors')).toBeInTheDocument();
    expect(screen.getByText('@network')).toBeInTheDocument();
    expect(screen.getByText('@performance')).toBeInTheDocument();
    expect(screen.getByText('@dom-changes')).toBeInTheDocument();
    expect(screen.getByText('@components')).toBeInTheDocument();
  });

  it('should filter options based on search term', () => {
    render(<ContextSelector {...defaultProps} searchTerm="console" />);
    
    expect(screen.getByText('@console')).toBeInTheDocument();
    expect(screen.queryByText('@network')).not.toBeInTheDocument();
    expect(screen.queryByText('@performance')).not.toBeInTheDocument();
  });

  it('should call onSelect when option is clicked', () => {
    render(<ContextSelector {...defaultProps} />);
    
    fireEvent.click(screen.getByText('@console'));
    
    expect(mockOnSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'console-all',
        type: 'console',
        label: '@console'
      })
    );
  });

  it('should position itself correctly', () => {
    const { container } = render(<ContextSelector {...defaultProps} />);
    const selector = container.querySelector('.context-selector');
    
    expect(selector).toHaveStyle({
      position: 'absolute',
      left: '100px',
      top: '200px'
    });
  });

  it('should handle keyboard navigation', () => {
    render(<ContextSelector {...defaultProps} />);
    
    // Simulate Arrow Down
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    // Should select second option
    const options = screen.getAllByRole('button');
    expect(options[1]).toHaveClass('selected');
  });

  it('should handle escape key', () => {
    render(<ContextSelector {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  it('should handle enter key to select current option', () => {
    render(<ContextSelector {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Enter' });
    
    expect(mockOnSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'console-all',
        type: 'console',
        label: '@console'
      })
    );
  });

  it('should show descriptions for each option', () => {
    render(<ContextSelector {...defaultProps} />);
    
    expect(screen.getByText('All console logs')).toBeInTheDocument();
    expect(screen.getByText('Console errors only')).toBeInTheDocument();
    expect(screen.getByText('All network requests')).toBeInTheDocument();
    expect(screen.getByText('Performance metrics')).toBeInTheDocument();
    expect(screen.getByText('Recent DOM mutations')).toBeInTheDocument();
    expect(screen.getByText('Selected React components')).toBeInTheDocument();
  });
});