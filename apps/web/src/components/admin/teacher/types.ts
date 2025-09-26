import type { client } from "@/utils/orpc";

export type Teacher = Awaited<ReturnType<typeof client.teacher.getAll>>[number];
