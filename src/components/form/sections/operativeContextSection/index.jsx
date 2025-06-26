import AutocompleteInput from "@/components/inputs/autocomplete";
import ErrorMessage from "@/components/errorMessage";
import { jurisdictionsList } from "@/utils/data/jurisdictions";
import { modalitiesList } from "@/utils/data/modalities"

export default function OperativeContextSection({
    form,
    errors,
    handleChange
}) {
    return (
        <>
            <section
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div>
                    <AutocompleteInput
                        isRequired={true}
                        error={errors.modalitie}
                        rule={"Seleccionar o tipear una modalidad"}
                        label='Modalidad'
                        data={modalitiesList}
                        name={"modalitie"}
                        setValue={handleChange}
                        value={form.modalitie}
                    />
                    <ErrorMessage
                        error={errors.modalitie}
                    />
                </div>

                <div>
                    <AutocompleteInput
                        rule={"Seleccionar o tipear una dependencia"}
                        label='Dependencia'
                        data={jurisdictionsList}
                        name={"jurisdiction"}
                        setValue={handleChange}
                        value={form.jurisdiction}
                    />
                    <ErrorMessage
                        error={errors.jurisdiction}
                    />
                </div>
            </section>
        </>
    )
}