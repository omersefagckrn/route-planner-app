export interface RegisterFormValues {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface LoginFormValues {
	email: string;
	password: string;
}
