import dotenv from "dotenv"
import { defineConfig } from 'drizzle-kit';

dotenv.config({path: ".env.local"})

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_8gQ1GRYOZPuL@ep-falling-night-a8il6lvy-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
  },
});
