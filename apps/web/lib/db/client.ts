import { MongoClient, Db } from "mongodb";
import { env } from "../env";

/**
 * Global cache to survive Next.js hot reloads in development.
 * This is safe because the Node.js process is reused.
 */
declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

/**
 * Create MongoClient lazily.
 * Never connect at module top-level.
 */
function createClient(): MongoClient {
  return new MongoClient(env.MONGODB_URI, {
    maxPoolSize: 10,
  });
}

if (process.env.NODE_ENV === "development") {
  if (!global.__mongoClientPromise) {
    client = createClient();
    global.__mongoClientPromise = client.connect();
  }
  clientPromise = global.__mongoClientPromise;
} else {
  client = createClient();
  clientPromise = client.connect();
}

/**
 * Internal helper to get connected MongoClient
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Internal helper to get database instance
 */
export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(env.MONGODB_DB_NAME);
}
