require('dotenv').config();
const aiService = require('./services/ai-service');

async function test() {
  console.log('🧪 Testing AI Service...\n');
  console.log('Environment check:');
  console.log('  OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'SET ✅' : 'MISSING ❌');
  console.log('  AI_MODEL:', process.env.AI_MODEL);
  console.log('\n');
  
  try {
    console.log('Generating 3 test questions...');
    const questions = await aiService.generateAssessmentQuestions('JavaScript', 'Beginner', 3);
    console.log('\n✅ SUCCESS! Generated', questions.length, 'questions\n');
    console.log('First question:');
    console.log('  Q:', questions[0].question);
    console.log('  Options:', questions[0].options);
    console.log('  Answer:', questions[0].correctAnswer);
    console.log('  Hint:', questions[0].hint);
    console.log('\n🎉 AI Service is working perfectly!');
  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.error('\nStack:', error.stack);
  }
}

test();