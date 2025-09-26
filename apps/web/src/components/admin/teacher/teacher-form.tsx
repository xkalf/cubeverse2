import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
		resolver: zodResolver(createTeacherSchema),
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
		if (isCreate) {
			createMutation.mutate(input);
		} else if (teacher) {
			updateMutation.mutate({ id: teacher.id, ...input });
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
				<div className="flex justify-end space-x-2">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isPending}
					>
						Cancel
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
