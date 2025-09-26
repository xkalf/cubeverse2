import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
	createTeacherSchema,
	teacherTable,
	updateTeacherSchema,
} from "@/db/schema/teacher";
import { protectedProcedure, publicProcedure } from "@/lib/orpc";

export const teacherRouter = {
	getAll: publicProcedure.handler(async () => {
		return await db.select().from(teacherTable);
	}),
	getById: publicProcedure
		.input(z.object({ id: z.number() }))
		.handler(async ({ input }) => {
			const result = await db
				.select()
				.from(teacherTable)
				.where(eq(teacherTable.id, input.id));
			return result[0];
		}),
	create: protectedProcedure
		.input(createTeacherSchema)
		.handler(async ({ input }) => {
			await db.insert(teacherTable).values(input);
		}),
	update: protectedProcedure
		.input(updateTeacherSchema)
		.handler(async ({ input }) => {
			await db
				.update(teacherTable)
				.set(input)
				.where(eq(teacherTable.id, input.id));
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.number() }))
		.handler(async ({ input }) => {
			await db
				.update(teacherTable)
				.set({
					isActive: false,
				})
				.where(eq(teacherTable.id, input.id));
		}),
};
