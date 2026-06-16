import "dotenv/config";
import app from "./app";
import { connectRedis, redisClient } from "./config/redis";
import { log } from "node:console";

const PORT = process.env.PORT || 5000;
async function startServer() {
  try {
    await connectRedis();
    // checking redis connection 
      const name = "name"
      const value = "subhamoy"
      await redisClient.set(name,value, {
    EX: 15  });
  // console.log(`Successfully set user in redis:  ${name}`);

      const setValue = await redisClient.get(name);
      console.log(`Successfully get user in redis:  ${setValue}`);
      setTimeout(async () => {
        console.log(await redisClient.get(name))
      }, 16000);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Redis Connection Failed:", error);
    process.exit(1);
  }
}

startServer();

