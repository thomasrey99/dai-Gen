import { Input } from "@heroui/input"
import { Tooltip } from "@heroui/react"

const InputText = ({ isRequired, name, label, handleChange, value, rule }) => {
    return (
        <>
            <Tooltip
                content={rule || ""}
                color="warning"
                placement="bottom-start"
            >
                <Input
                    isRequired={isRequired || false}
                    className="w-full"
                    name={name}
                    onChange={handleChange}
                    value={value === null ? "" : value}
                    label={label}
                    type="text"
                    variant="flat"
                />
            </Tooltip>
        </>

    )
}

export default InputText