import { cronJobs } from "convex/server";
import { api, internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "compare_images",
  { hours: 24 }, // every day
  api.filesActions.compareImages,
  {
    machineToken: process.env.CONVEX_MACHINE_TOKEN as string,
    pageSize: 20,
    cursor: null,
  }
);

export default crons;
