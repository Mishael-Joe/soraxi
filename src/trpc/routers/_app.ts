import { userRouter } from "@/modules/server/procedures";
import { createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  users: userRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
