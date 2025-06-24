export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '400px'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  message: {
    backgroundColor: '#2a2a2a',
    padding: '8px 12px',
    borderRadius: '6px',
    maxWidth: '85%',
    alignSelf: 'flex-end'
  },
  assistantMessage: {
    backgroundColor: '#3a3a3a',
    alignSelf: 'flex-start'
  },
  loadingMessage: {
    padding: '8px 12px',
    color: '#888'
  },
  errorMessage: {
    padding: '8px 12px',
    color: '#ff4444'
  },
  form: {
    borderTop: '1px solid #2a2a2a',
    padding: '12px',
    display: 'flex',
    gap: '8px'
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    border: 'none',
    borderRadius: '4px',
    padding: '8px',
    color: '#ffffff',
    resize: 'none',
    height: '36px',
    lineHeight: '20px'
  },
  button: {
    backgroundColor: '#4a4a4a',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    color: '#ffffff',
    cursor: 'pointer',
    opacity: 1
  },
  buttonDisabled: {
    cursor: 'not-allowed',
    opacity: 0.7
  }
} as const; 