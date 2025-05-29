import { DatePicker } from '@heroui/react';
import { I18nProvider } from '@react-aria/i18n';

const InputDate = ({ value, handleChange, label }) => {
    console.log("lo que llega por value",value)
    const onHandleChange = (e) => {
        if (!e) {
            handleChange(null);
            return;
        }

        handleChange(e);
    };

    return (
        <I18nProvider locale="es-AR">
            <DatePicker
                className='w-full'
                variant='faded'
                value={value || null}
                onChange={onHandleChange}
                label={label}
            />
        </I18nProvider>
    );
};

export default InputDate;
