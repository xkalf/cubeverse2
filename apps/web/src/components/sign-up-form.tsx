import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import { Button } from "./ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

const signUpSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const navigate = useNavigate({
		from: "/",
	});
	const { isPending } = authClient.useSession();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
	});

	const handleSubmit = form.handleSubmit(async (value) => {
		setIsLoading(true);
		await authClient.signUp.email(
			{
				email: value.email,
				password: value.password,
				name: value.name,
			},
			{
				onSuccess: () => {
					navigate({
						to: "/dashboard",
					});
					toast.success("Sign up successful");
				},
				onError: (error) => {
					toast.error(error.error.message || error.error.statusText);
				},
			},
		);
		setIsLoading(false);
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="mx-auto mt-10 w-full max-w-md p-6">
			<h1 className="mb-6 text-center font-bold text-3xl">Create Account</h1>

			<Form {...form}>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>Нэр</FormLabel>
									<FormControl>
										<Input id={field.name} {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className="space-y-2">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>Имэйл</FormLabel>
									<FormControl>
										<Input id={field.name} type="email" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className="space-y-2">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor={field.name}>Нууц үг</FormLabel>
									<FormControl>
										<Input id={field.name} type="password" {...field} />
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Уншиж байна..." : "Бүртгүүлэх"}
					</Button>
				</form>
			</Form>

			<div className="mt-4 text-center">
				<Button
					variant="link"
					onClick={onSwitchToSignIn}
					className="text-indigo-600 hover:text-indigo-800"
				>
					Бүртгэлтэй юу? Нэвтрэх
				</Button>
			</div>
		</div>
	);
}
