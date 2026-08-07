const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv/config");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.feedbackTheme.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.theme.deleteMany();
  await prisma.user.deleteMany();
  await prisma.report.deleteMany();
  await prisma.workspace.deleteMany();

  // 1. Create Demo Workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: "Acme Corp (Demo)",
    },
  });

  // 2. Create Users for RBAC
  await prisma.user.createMany({
    data: [
      { email: "admin@acme.com", name: "Alice Admin", role: "ADMIN", passwordHash: "dummy_hash_123", workspaceId: workspace.id },
      { email: "analyst@acme.com", name: "Bob Analyst", role: "ANALYST", passwordHash: "dummy_hash_123", workspaceId: workspace.id },
      { email: "viewer@acme.com", name: "Charlie Viewer", role: "VIEWER", passwordHash: "dummy_hash_123", workspaceId: workspace.id },
    ],
  });

  // 3. Generate Realistic Feedback Items
  const channels = ["App Store", "Twitter", "Email", "Support Ticket"];
  const sentiments = ["Positive", "Neutral", "Negative"];
  const samples = [
    "The app crashes whenever I click checkout on mobile.",
    "Love the new dark mode feature, super clean UI!",
    "Please add integration with Google Calendar.",
    "Exporting monthly reports takes way too long.",
    "Customer support resolved my billing issue in 5 minutes.",
    "The navigation menu is confusing on smaller screens."
  ];

  const feedbackData = [];
  for (let i = 0; i < 120; i++) {
    const textSample = samples[i % samples.length] + ` (Ref #${i + 1})`;
    feedbackData.push({
      content: textSample,
      channel: channels[i % channels.length],
      sentiment: sentiments[i % sentiments.length],
      status: i % 2 === 0 ? "NEW" : "REVIEWED",
      workspaceId: workspace.id,
    });
  }

  await prisma.feedback.createMany({
    data: feedbackData,
  });

  console.log("Database seeded successfully with workspace, users, and 120 feedback items!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });