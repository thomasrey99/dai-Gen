const { Textarea } = require("@heroui/input")

const InputTextArea = ({ isRequired, error, name, handleChange, label, value }) => {
  return (
    <Textarea
      isRequired={isRequired || false}
      isInvalid={error?true:false}
      errorMessage={error?error:""}
      disableAutosize
      classNames={{
        base: "w-full",
        input: "resize-y min-h-[200px]",
      }}
      placeholder="Ingresa una reseña del hecho"
      variant="faded"
      name={name}
      onChange={handleChange}
      value={value}
    />
  )
}

export default InputTextArea