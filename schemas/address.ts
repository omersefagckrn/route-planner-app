import * as yup from 'yup';

export const addressSchema = yup.object().shape({
	title: yup.string().required('Başlık zorunludur').min(3, 'Başlık en az 3 karakter olmalıdır'),
	address: yup.string().required('Adres zorunludur').min(10, 'Adres en az 10 karakter olmalıdır'),
	latitude: yup
		.number()
		.transform((value, originalValue) => {
			return originalValue === '' ? undefined : value;
		})
		.typeError('Enlem sayısal bir değer olmalıdır')
		.min(-90, 'Enlem değeri -90 ile 90 arasında olmalıdır')
		.max(90, 'Enlem değeri -90 ile 90 arasında olmalıdır')
		.test('is-valid-number', 'Geçerli bir enlem değeri giriniz', (value) => {
			if (value === undefined) return true;
			return !isNaN(value);
		}),
	longitude: yup
		.number()
		.transform((value, originalValue) => {
			return originalValue === '' ? undefined : value;
		})
		.typeError('Boylam sayısal bir değer olmalıdır')
		.min(-180, 'Boylam değeri -180 ile 180 arasında olmalıdır')
		.max(180, 'Boylam değeri -180 ile 180 arasında olmalıdır')
		.test('is-valid-number', 'Geçerli bir boylam değeri giriniz', (value) => {
			if (value === undefined) return true;
			return !isNaN(value);
		}),
	is_favorite: yup.boolean().default(false),
	user_id: yup.string().required('Kullanıcı ID zorunludur')
});
