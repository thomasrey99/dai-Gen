import AutocompleteInput from "@/components/inputs/autocomplete";
import ErrorMessage from "@/components/errorMessage";
import { operatorsList } from "@/utils/data/operators"
import { intervenersList } from "@/utils/data/interveners"

export default function OperatorSection({
    form,
    errors,
    handleChange
}) {
    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <AutocompleteInput
                        isRequired={true}
                        error={errors.operator}
                        rule={"Seleccionar o tipear apellido del visualizador"}
                        label='Visualizador' data={operatorsList}
                        name={"operator"} setValue={handleChange}
                        value={form.operator}
                    />
                    <ErrorMessage
                        error={errors.operator}
                    />
                </div>

                <div>
                    <AutocompleteInput
                        isRequired={true}
                        error={errors.intervener}
                        rule={"Seleccionar o tipear apellido del interventor"}
                        label='Interventor'
                        data={intervenersList}
                        name={"intervener"}
                        setValue={handleChange}
                        value={form.intervener}
                    />
                    <ErrorMessage
                        error={errors.intervener}
                    />
                </div>
            </section>
        </>
    )
}