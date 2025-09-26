import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
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
});

export const createTeacherSchema = createInsertSchema(teacherTable);
export const updateTeacherSchema = createUpdateSchema(teacherTable).required({
	id: true,
});
