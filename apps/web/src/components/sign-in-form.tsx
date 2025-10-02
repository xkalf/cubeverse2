import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignInForm({
	onSwitchToSignUp,
}: {
	onSwitchToSignUp: () => void;
}) {
	const navigate = useNavigate({
		from: "/",
	});
	const { isPending } = authClient.useSession();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleSubmit = form.handleSubmit(async (value) => {
		setIsLoading(true);
		const { error } = await authClient.signIn.email({
			email: value.email,
			password: value.password,
		});

		setIsLoading(false);

		if (error) {
			toast.error(error.message || error.statusText);
		} else {
			navigate({
				to: "/dashboard",
			});
			toast.success("Sign in successful");
		}
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="mx-auto mt-10 w-full max-w-md p-6">
			<h1 className="mb-6 text-center font-bold text-3xl">Cubeverse</h1>
			<Form {...form}>
				<form onSubmit={handleSubmit} className="space-y-4">
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
						{isLoading ? "Уншиж байна..." : "Нэвтрэх"}
					</Button>
				</form>
			</Form>

			<div className="mt-4 text-center">
				<Button
					variant="link"
					onClick={onSwitchToSignUp}
					className="text-indigo-600 hover:text-indigo-800"
				>
					Бүртгэлгүй юу? Бүртгүүлэх
				</Button>
			</div>
		</div>
	);
}
