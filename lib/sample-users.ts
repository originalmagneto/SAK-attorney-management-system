import bcrypt from 'bcryptjs';
import { store } from './store';

// Create a sample user for testing
async function createSampleUser() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const sampleUser = {
    id: 'user_1',
    email: 'test@example.com',
    name: 'Test User',
    passwordHash: hashedPassword,
    role: 'STAFF' as const,
    firmId: undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  store.addUser(sampleUser);
}

// Initialize sample data
createSampleUser().catch(console.error);