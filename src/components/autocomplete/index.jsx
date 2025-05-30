import { Autocomplete, AutocompleteItem } from "@heroui/react";


export default function AutocompleteInput({ name, data, label = "seleccionar", setValue, value }) {
    const handleChange = (value) => {
        if (!value) {
            setValue(name, "")
        } else {
            setValue(name, value)
            return;
        }
    }
    return (
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Autocomplete
                allowsCustomValue
                label={label}
                placeholder={`Seleccionar ${label}`}
                className="w-full"
                name={name}
                variant="faded"
                defaultItems={data || []}
                onInputChange={handleChange}
                onSelectionChange={handleChange}
                inputValue={value}
            >
                {data.map((item) => (
                    <AutocompleteItem key={item}>{item}</AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}
