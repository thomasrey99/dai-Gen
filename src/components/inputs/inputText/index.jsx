import { Input } from "@heroui/input"
import { Tooltip } from "@heroui/react"

const InputText = ({ name, label, handleChange, value, rule }) => {
    return (
        <>
            <Tooltip
                content={rule || ""}
                color="warning"
                placement="bottom-start"
            >
                <Input
                    className="w-full"
                    name={name}
                    onChange={handleChange}
                    value={value}
                    label={label}
                    type="text"
                    variant="faded"
                />
            </Tooltip>
        </>

    )
}

export default InputText