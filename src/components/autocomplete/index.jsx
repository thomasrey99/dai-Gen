import { Autocomplete, AutocompleteItem, Tooltip } from "@heroui/react";


export default function AutocompleteInput({ isRequired = false, name, data, label = "seleccionar", setValue, value, rule }) {
    const handleChange = (value) => {
        if (!value) {
            setValue(name, "")
        } else {
            setValue(name, value)
            return;
        }
    }
    return (
        <>
            <Tooltip
                content={rule || ""}
                color="warning"
                placement="bottom-start"
            >
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Autocomplete
                        isRequired={isRequired}
                        allowsCustomValue
                        label={label}
                        className="w-full"
                        name={name}
                        defaultItems={data || []}
                        onInputChange={handleChange}
                        onSelectionChange={handleChange}
                        inputValue={value === null ? "" : value}
                        variant="flat"
                    >
                        {data.map((item) => (
                            <AutocompleteItem key={item}>{item}</AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>
            </Tooltip>
        </>


    );
}
