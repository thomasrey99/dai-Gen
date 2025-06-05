import { Input } from "@heroui/input"
import { Tooltip } from "@heroui/react"

const InputText = ({isRequired, name, label, handleChange, value, rule, error }) => {
    return (
        <>
            <Tooltip
                content={rule || ""}
                color="warning"
                placement="bottom-start"
            >
                <Input
                    isRequired={isRequired||false}
                    className="w-full"
                    color={value===null?"default":error?"danger":"default"}
                    isInvalid={error?true:false}
                    errorMessage={error || ""}
                    name={name}
                    onChange={handleChange}
                    value={value === null ? "" : value}
                    label={label}
                    type="text"
                    variant="faded"
                />
            </Tooltip>
        </>

    )
}

export default InputText