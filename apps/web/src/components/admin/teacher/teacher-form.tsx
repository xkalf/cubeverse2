import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";
import { createTeacherSchema } from "../../../../../server/src/db/schema/teacher";
import type { Teacher } from "./types";

interface TeacherFormProps {
	teacher?: Teacher;
	onClose: () => void;
	isCreate?: boolean;
}

export function TeacherForm({
	teacher,
	onClose,
	isCreate = false,
}: TeacherFormProps) {
	const queryClient = useQueryClient();

	const form = useForm({
		resolver: zodResolver(
			createTeacherSchema.extend({
				experience: z.object({ value: z.string() }).array(),
				rewards: z.object({ value: z.string() }).array(),
			}),
		),
		defaultValues: {
			firstname: teacher?.firstname || "",
			lastname: teacher?.lastname || "",
			startedYear: teacher?.startedYear || new Date().getFullYear(),
			teachingYear: teacher?.teachingYear || new Date().getFullYear(),
			experience: teacher?.experience.map((i) => ({ value: i })) || [
				{ value: "" },
			],
			rewards: teacher?.rewards.map((i) => ({ value: i })) || [{ value: "" }],
		},
	});

	const experienceFields = useFieldArray({
		control: form.control,
		name: "experience",
	});

	const rewardsFields = useFieldArray({
		control: form.control,
		name: "rewards",
	});

	const createMutation = useMutation(
		orpc.teacher.create.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.teacher.getAll.queryKey(),
				});
				onClose();
			},
		}),
	);

	const updateMutation = useMutation(
		orpc.teacher.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.teacher.getAll.queryKey(),
				});
				onClose();
			},
		}),
	);

	const handleSubmit = form.handleSubmit((input) => {
		const processedInput = {
			...input,
			experience: input.experience.map((i) => i.value).filter(Boolean),
			rewards: input.rewards.map((i) => i.value).filter(Boolean),
		};

		if (isCreate) {
			createMutation.mutate(processedInput);
		} else if (teacher) {
			updateMutation.mutate({ id: teacher.id, ...processedInput });
		}
	});

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-2">
					<FormField
						control={form.control}
						name="lastname"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={field.name}>Овог</FormLabel>
								<FormControl>
									<Input id={field.name} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="space-y-2">
					<FormField
						control={form.control}
						name="firstname"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={field.name}>Нэр</FormLabel>
								<FormControl>
									<Input id={field.name} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="space-y-2">
					<FormField
						control={form.control}
						name="startedYear"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={field.name}>Хичээллэж эхэлсэн он</FormLabel>
								<FormControl>
									<Input
										type={"number"}
										id={field.name}
										value={field.value}
										onChange={(e) => field.onChange(e.target.valueAsNumber)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="space-y-2">
					<FormField
						control={form.control}
						name="teachingYear"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={field.name}>Багшилж эхэлсэн он</FormLabel>
								<FormControl>
									<Input
										type={"number"}
										id={field.name}
										value={field.value}
										onChange={(e) => field.onChange(e.target.valueAsNumber)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<FormLabel>Туршлага</FormLabel>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => experienceFields.append({ value: "" })}
							disabled={isPending}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					{experienceFields.fields.map((field, index) => (
						<div key={field.id} className="flex items-center space-x-2">
							<FormField
								control={form.control}
								name={`experience.${index}.value`}
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Input {...field} placeholder="Туршлага оруулах" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{experienceFields.fields.length > 1 && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => experienceFields.remove(index)}
									disabled={isPending}
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					))}
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<FormLabel>Амжилтууд</FormLabel>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => rewardsFields.append({ value: "" })}
							disabled={isPending}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					{rewardsFields.fields.map((field, index) => (
						<div key={field.id} className="flex items-center space-x-2">
							<FormField
								control={form.control}
								name={`rewards.${index}.value`}
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Input {...field} placeholder="Амжилт оруулах" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{rewardsFields.fields.length > 1 && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => rewardsFields.remove(index)}
									disabled={isPending}
								>
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					))}
				</div>
				<div className="flex justify-end space-x-2">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isPending}
					>
						Цуцлах
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : isCreate ? (
							"Бүртгэх"
						) : (
							"Шинэчлэх"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
