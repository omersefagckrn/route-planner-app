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
	email: Yup.string().email('Geçerli bir e-posta adresi giriniz').required('E-posta zorunludur').max(255, 'E-posta adresi çok uzun'),
	password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').max(50, 'Şifre çok uzun').required('Şifre zorunludur')
});

export const RegisterSchema = Yup.object().shape({
	firstName: Yup.string()
		.min(2, 'İsim en az 2 karakter olmalıdır')
		.max(50, 'İsim en fazla 50 karakter olabilir')
		.matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf içerebilir')
		.required('İsim zorunludur'),
	lastName: Yup.string()
		.min(2, 'Soyisim en az 2 karakter olmalıdır')
		.max(50, 'Soyisim en fazla 50 karakter olabilir')
		.matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Soyisim sadece harf içerebilir')
		.required('Soyisim zorunludur'),
	phone: Yup.string().matches(phoneRegExp, 'Geçerli bir telefon numarası giriniz (5XX) XXX-XXXX').required('Telefon numarası zorunludur'),
	email: Yup.string().email('Geçerli bir e-posta adresi giriniz').max(255, 'E-posta adresi çok uzun').required('E-posta zorunludur'),
	password: Yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').max(50, 'Şifre çok uzun').matches(/[a-z]/, 'Şifre en az bir küçük harf içermelidir').required('Şifre zorunludur'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
		.required('Şifre tekrarı zorunludur')
});

export const ChangePasswordSchema = Yup.object().shape({
	currentPassword: Yup.string().required('Mevcut şifre zorunludur'),
	newPassword: Yup.string()
		.min(6, 'Şifre en az 6 karakter olmalıdır')
		.max(50, 'Şifre çok uzun')
		.matches(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
		.matches(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
		.matches(/[0-9]/, 'Şifre en az bir rakam içermelidir')
		.notOneOf([Yup.ref('currentPassword')], 'Yeni şifre mevcut şifre ile aynı olamaz')
		.required('Yeni şifre zorunludur'),
	confirmNewPassword: Yup.string()
		.oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor')
		.required('Şifre tekrarı zorunludur')
});

export const EditProfileSchema = Yup.object().shape({
	first_name: Yup.string()
		.min(2, 'İsim en az 2 karakter olmalıdır')
		.max(50, 'İsim en fazla 50 karakter olabilir')
		.matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'İsim sadece harf içerebilir')
		.required('Ad zorunludur'),
	last_name: Yup.string()
		.min(2, 'Soyisim en az 2 karakter olmalıdır')
		.max(50, 'Soyisim en fazla 50 karakter olabilir')
		.matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Soyisim sadece harf içerebilir')
		.required('Soyad zorunludur'),
	phone: Yup.string().matches(phoneRegExp, 'Geçerli bir telefon numarası giriniz (5XX) XXX-XXXX').required('Telefon numarası zorunludur')
});
