import * as Yup from 'yup';

// Türkiye telefon numarası (5XX) XXX-XXXX
const phoneRegExp = /^\(\d{3}\)\s\d{3}-\d{4}$/;

export interface LoginFormValues {
	email: string;
	password: string;
}

export interface RegisterFormValues {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	confirmPassword: string;
}

export interface ChangePasswordFormValues {
	currentPassword: string;
	newPassword: string;
	confirmNewPassword: string;
}

export interface EditProfileFormValues {
	first_name: string;
	last_name: string;
	phone: string;
}

export const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta zorunludur'),
	password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur')
});

export const RegisterSchema = Yup.object().shape({
	firstName: Yup.string().min(2, 'İsim çok kısa').max(50, 'İsim çok uzun').required('İsim zorunludur'),
	lastName: Yup.string().min(2, 'Soyisim çok kısa').max(50, 'Soyisim çok uzun').required('Soyisim zorunludur'),
	phone: Yup.string().matches(phoneRegExp, 'Lütfen (5XX) XXX-XXXX formatında girin').required('Telefon numarası zorunludur'),
	email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta zorunludur'),
	password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').required('Şifre zorunludur'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
		.required('Şifre tekrarı zorunludur')
});

export const ChangePasswordSchema = Yup.object().shape({
	currentPassword: Yup.string().required('Mevcut şifre zorunludur'),
	newPassword: Yup.string()
		.min(6, 'Şifre en az 6 karakter olmalıdır')
		.notOneOf([Yup.ref('currentPassword')], 'Yeni şifre mevcut şifre ile aynı olamaz')
		.required('Yeni şifre zorunludur'),
	confirmNewPassword: Yup.string()
		.oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor')
		.required('Şifre tekrarı zorunludur')
});

export const EditProfileSchema = Yup.object().shape({
	first_name: Yup.string().required('Ad zorunludur'),
	last_name: Yup.string().required('Soyad zorunludur'),
	phone: Yup.string().required('Telefon numarası zorunludur')
});
