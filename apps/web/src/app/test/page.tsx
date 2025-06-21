export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">React LLM Test Page</h1>
        <p className="text-lg text-gray-400">
          React LLM should appear in the bottom-right corner.
        </p>
        <p className="text-sm text-gray-500">
          Check the browser console for initialization logs.
        </p>
        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Component</h2>
          <p>This is a simple React component you can interact with.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
            Click Me
          </button>
        </div>
      </div>
    </div>
  );
}