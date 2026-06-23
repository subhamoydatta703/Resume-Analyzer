import { Worker } from "bullmq";
import { bullRedisConnection } from "../config/redis.bullmq";
import { analyzeThisResume } from "./resumeAnalysisService";
import { workerPrisma } from "../config/workerDB";

let worker: Worker;

async function startWorker() {
  console.log("BullMQ Worker starting...");
  worker = new Worker("resume-analysis", async (job) => {
    const { fileID } = job.data;
    console.log(`Processing job ${job.id} for file ${fileID}`);
  console.log("Worker start worker function in worker service runs...")
    
    if (!fileID) {
      throw new Error("Invalid or missing file ID");
    }

    console.log(`Processing job ${job.id} for file ${fileID}`);

    await workerPrisma.resume.update({
      where: { id: fileID },
      data: { status: "PROCESSING" },
    });

    await analyzeThisResume(fileID);

  }, {
    connection: bullRedisConnection,
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully`);
  });

  worker.on("failed", async (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
    if (job?.data?.fileID) {
      await workerPrisma.resume.update({
        where: { id: job.data.fileID },
        data: { status: "FAILED" },
      });
    }
  });

  worker.on("error", (err) => {
    console.error("Worker runtime error:", err.message);
  });

  console.log("BullMQ Worker started successfully");
}

startWorker();