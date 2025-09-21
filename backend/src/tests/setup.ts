import { prisma } from '../config/database';

// Test setup
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Clean up and disconnect
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up test data before each test
  await prisma.proposalItem.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.rFPItem.deleteMany();
  await prisma.rFP.deleteMany();
  await prisma.product.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
});
