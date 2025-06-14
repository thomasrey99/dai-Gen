const { Textarea } = require("@heroui/input")

const InputTextArea = ({ isRequired, name, handleChange, value }) => {
  return (
    <Textarea
      isRequired={isRequired || false}
      disableAutosize
      classNames={{
        base: "w-full",
        input: "resize-y min-h-[200px]",
      }}
      placeholder="Ingresa una reseña del hecho"
      variant="flat"
      name={name}
      onChange={handleChange}
      value={value}
    />
  )
}

export default InputTextArea