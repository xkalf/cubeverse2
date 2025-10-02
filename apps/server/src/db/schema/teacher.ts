import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import z from "zod";
import {
	createInsertSchema,
	createUpdateSchema,
} from "@/lib/validation-factory";

export const teacherTable = sqliteTable("teacher", {
	id: integer().primaryKey({ autoIncrement: true }),
	firstname: text().notNull(),
	lastname: text().notNull(),
	isActive: integer({
		mode: "boolean",
	}).default(true),
	startedYear: integer({
		mode: "number",
	}).notNull(),
	teachingYear: integer({
		mode: "number",
	}).notNull(),
	experience: text({
		mode: "json",
	})
		.notNull()
		.$type<string[]>()
		.$default(() => sql`'[]'`),
	rewards: text({
		mode: "json",
	})
		.notNull()
		.$type<string[]>()
		.default(sql`'[]'`),
});

export const createTeacherSchema = createInsertSchema(teacherTable, {
	experience: z.string().array().default([]),
	rewards: z.string().array().default([]),
	startedYear: z.number(),
	teachingYear: z.number(),
});
export const updateTeacherSchema = createUpdateSchema(teacherTable, {
	experience: z.string().array().default([]),
	rewards: z.string().array().default([]),
}).required({
	id: true,
});
