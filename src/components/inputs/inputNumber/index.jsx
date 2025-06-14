import { NumberInput, Tooltip } from "@heroui/react";

const InputNumber = ({rule, name = "", label = "", value = "", setValue, isRequired = false, }) => {
    return (
        <Tooltip
            content={rule || ""}
            color="warning"
            placement="bottom-start"
        >
            <NumberInput
                maxLength={9}
                isRequired={isRequired}
                className="w-full"
                label={label}
                value={value}
                onChange={setValue}
                name={name}
                variant="flat"
            />
        </Tooltip>

    );
}

export default InputNumber;