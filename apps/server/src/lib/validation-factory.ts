import { createSchemaFactory } from "drizzle-zod";
import z from "zod";

export const { createInsertSchema, createSelectSchema, createUpdateSchema } =
	createSchemaFactory({
		zodInstance: z,
		coerce: {
			number: true,
			date: true,
		},
	});
