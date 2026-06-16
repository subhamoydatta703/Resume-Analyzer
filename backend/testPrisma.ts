import { prisma } from "./src/config/db";

async function runTest() {
  console.log("Querying database resumes...");
  try {
    const resumes = await prisma.resume.findMany();
    console.log("Resumes in database:", JSON.stringify(resumes, null, 2));
  } catch (error) {
    console.error("Database query failed:", error);
  }
}

runTest();
