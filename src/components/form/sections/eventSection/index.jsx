'use client'
import AutocompleteInput from "@/components/inputs/autocomplete"
import InputText from "@/components/inputs/inputText"
import ErrorMessage from "@/components/errorMessage"
import { areasList } from "@/utils/data/areas"
import { typesOfInterventionList } from "@/utils/data/typeOfInterventions"

export default function EventSection({
    form,
    errors,
    handleChange
}) {
    return (
        <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <AutocompleteInput
                        isRequired
                        error={errors.area}
                        rule="DAI / SARIM / DAI Y SARIM"
                        label="Área"
                        data={areasList}
                        name="area"
                        setValue={handleChange}
                        value={form.area}
                    />
                    <ErrorMessage error={errors.area} />
                </div>

                <div>
                    <AutocompleteInput
                        isRequired
                        error={errors.typeOfIntervention}
                        rule="SAE / REG LEGALES / V.S.I / P.J. / PRENSA / V.C.A"
                        label="Tipo de visualización"
                        data={typesOfInterventionList}
                        name="typeOfIntervention"
                        setValue={handleChange}
                        value={form.typeOfIntervention}
                    />
                    <ErrorMessage error={errors.typeOfIntervention} />
                </div>

                <div>
                    <InputText
                        isRequired
                        error={errors.number}
                        rule="Nº de SAE/REG LEGALES o Nombre"
                        name="number"
                        label="Nro / Nombre"
                        handleChange={handleChange}
                        value={form.number}
                        placeholder="Ingresar número"
                    />
                    <ErrorMessage error={errors.number} />
                </div>
            </section>
        </>
    )
}
