'use client';
import { TimeInput, Tooltip } from "@heroui/react";
import { parseTime } from "@internationalized/date";

export const ClockCircleLinearIcon = (props) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="1em"
            role="presentation"
            viewBox="0 0 24 24"
            width="1em"
            {...props}
        >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    );
};

const InputTime = ({ label, name, value, handleChange, rule }) => {
    return (
        <>
            <Tooltip
                content={rule || ""}
                color="warning"
                placement="bottom-start"
            >
                <TimeInput
                    startContent={
                        <ClockCircleLinearIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                    className="w-full"
                    variant="faded"
                    value={value ? parseTime(value) : null} // convierte el string a TimeValue
                    name={name}
                    granularity="second"
                    label={label}
                    hourCycle={24}
                    onChange={(newValue) => {
                        if (newValue) {
                            const timeStr = `${String(newValue.hour).padStart(2, '0')}:${String(newValue.minute).padStart(2, '0')}:${String(newValue.second).padStart(2, '0')}`;
                            handleChange({ target: { name, value: timeStr } });
                        } else {
                            handleChange({ target: { name, value: '' } });
                        }
                    }}

                />
            </Tooltip>
        </>

    );
};

export default InputTime;
