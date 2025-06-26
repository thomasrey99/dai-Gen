import { Autocomplete, AutocompleteItem, Tooltip } from "@heroui/react";

export default function AutocompleteInput({
    isRequired = false,
    name,
    data = [],
    label = "seleccionar",
    setValue,
    value,
    rule
}) {
    const handleSelectionChange = (selectedKey) => {
        const selectedValue = selectedKey ?? "";
        console.log("seleccionado:", selectedValue)
        setValue({ name, value: selectedValue });
    };

    return (
        <Tooltip content={rule || ""} color="warning" placement="bottom-start">
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                <Autocomplete
                    isRequired={isRequired}
                    allowsCustomValue
                    label={label}
                    className="w-full"
                    name={name}
                    defaultItems={data}
                    inputValue={value ?? ""}
                    onSelectionChange={handleSelectionChange}
                    onInputChange={(input) => setValue({ name, value: input })}
                    variant="flat"
                >
                    {data.map((item) => (
                        <AutocompleteItem key={item} textValue={item}>
                            {item}
                        </AutocompleteItem>
                    ))}
                </Autocomplete>
            </div>
        </Tooltip>
    );
}
