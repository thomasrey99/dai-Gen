import { DatePicker, Tooltip } from '@heroui/react';
import { I18nProvider } from '@react-aria/i18n';

const InputDate = ({ value, handleChange, label, rule }) => {
    const onHandleChange = (e) => {
        if (!e) {
            handleChange(null);
            return;
        }

        handleChange(e);
    };

    return (
        <I18nProvider locale="es-AR">
            <Tooltip
                content={rule || ""}
                color="warning"
                placement="bottom-start"
            >
                <DatePicker
                    className='w-full'
                    variant='faded'
                    value={value || null}
                    onChange={onHandleChange}
                    label={label}
                /></Tooltip>
        </I18nProvider>
    );
};

export default InputDate;
