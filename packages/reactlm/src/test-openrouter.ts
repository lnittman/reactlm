/**
 * Test script for OpenRouter integration
 * This file should not be included in the production build
 */

import { OpenRouterClient } from './llm/openrouter-client';
import { LLMHub } from './llm/providers';

// Test OpenRouter client directly
export async function testOpenRouterClient(apiKey: string) {
  console.log('🧪 Testing OpenRouter client...');
  
  const client = new OpenRouterClient({
    apiKey,
    siteUrl: 'https://test.example.com',
    siteName: 'React LLM Test'
  });
  
  // Wait for initialization
  if (!client.isReady()) {
    console.log('⏳ Waiting for client initialization...');
    await new Promise((resolve, reject) => {
      client.once('ready', resolve);
      client.once('error', reject);
      setTimeout(() => reject(new Error('Timeout')), 10000);
    });
  }
  
  console.log('✅ Client initialized');
  
  // Test model fetching
  try {
    const models = await client.getLatestModels();
    console.log(`📋 Found ${models.length} models`);
    
    const recommended = client.getRecommendedModels();
    console.log(`⭐ ${recommended.length} recommended models:`, 
      recommended.map(m => m.id).slice(0, 3)
    );
    
    // Test with a simple chat completion
    const testModel = recommended[0]?.id || models[0]?.id;
    if (testModel) {
      console.log(`💬 Testing chat with model: ${testModel}`);
      
      const result = await client.completeChat([
        { role: 'user', content: 'Say "Hello from React LLM!" and nothing else.' }
      ], { model: testModel });
      
      console.log('💭 Response:', result.content.substring(0, 100));
      console.log('📊 Usage:', result.usage);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Test LLM Hub integration
export async function testLLMHub(apiKey: string) {
  console.log('🧪 Testing LLM Hub...');
  
  const hub = new LLMHub();
  
  try {
    // Initialize provider
    await hub.initializeProvider('openrouter', apiKey, {
      siteUrl: 'https://test.example.com',
      siteName: 'React LLM Test'
    });
    
    console.log('✅ Hub initialized');
    console.log('🤖 Active model:', hub.getActiveModel());
    
    // Test streaming chat
    console.log('💬 Testing streaming chat...');
    let response = '';
    
    const messages = [
      { role: 'user' as const, content: 'Count from 1 to 5, one number per line.' }
    ];
    
    for await (const chunk of hub.chat(messages)) {
      response += chunk;
      process.stdout.write(chunk);
    }
    
    console.log('\n✅ Streaming test completed');
    console.log('📝 Full response length:', response.length);
    
    return true;
  } catch (error) {
    console.error('❌ Hub test failed:', error);
    return false;
  }
}

// Main test function
export async function runTests(apiKey?: string) {
  if (!apiKey) {
    console.log('⚠️  No API key provided, skipping live tests');
    return;
  }
  
  console.log('🚀 Starting OpenRouter integration tests...\n');
  
  const clientTest = await testOpenRouterClient(apiKey);
  console.log('\n' + '='.repeat(50) + '\n');
  
  const hubTest = await testLLMHub(apiKey);
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test Summary:');
  console.log(`   OpenRouter Client: ${clientTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   LLM Hub: ${hubTest ? '✅ PASS' : '❌ FAIL'}`);
  
  return clientTest && hubTest;
}

// For Node.js testing
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
  const apiKey = process.env.OPENROUTER_API_KEY;
  runTests(apiKey).then(success => {
    process.exit(success ? 0 : 1);
  });
}