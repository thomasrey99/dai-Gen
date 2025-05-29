import { Input } from "@heroui/input"

const InputText = ({ name, label, placeholder, handleChange, value }) => {
    return (
        <Input
            className="w-full"
            name={name}
            onChange={handleChange}
            value={value}
            label={label}
            placeholder={placeholder}
            type="text"
            variant="faded"
        />
    )
}

export default InputText