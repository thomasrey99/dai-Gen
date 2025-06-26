import AutocompleteInput from "@/components/inputs/autocomplete";
import ErrorMessage from "@/components/errorMessage";
import InputText from "@/components/inputs/inputText";
import {justicesList} from "@/utils/data/justice"

export default function JusticeSection({
    form,
    errors,
    handleChange
}) {
    return (
        <>
            <section className="flex flex-col md:block">
                <div className="w-full mb-6">
                    <AutocompleteInput
                        rule={"Seleccionar o tipear la Justicia que intervino"}
                        label="Justicia"
                        data={justicesList}
                        name="justice"
                        setValue={handleChange}
                        value={form.interveningJustice.justice}
                    />
                    <ErrorMessage error={errors.justice} />
                </div>

                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="w-full md:w-1/2">
                        <InputText
                            rule={"Debe estar en mayúscula, con el prefijo DR. o DRA."}
                            error={errors.fiscal}
                            name="fiscal"
                            label="Fiscal a/c"
                            handleChange={handleChange}
                            value={form.interveningJustice.fiscal}
                            placeholder="Ingresar nombre"
                        />
                        <ErrorMessage error={errors.fiscal} />
                    </div>

                    <div className="w-full md:w-1/2">
                        <InputText
                            rule={"Debe estar en mayúscula, con el prefijo DR. o DRA."}
                            error={errors.secretariat}
                            name="secretariat"
                            label="Secretaría a/c"
                            handleChange={handleChange}
                            value={form.interveningJustice.secretariat}
                            placeholder="Ingresar nombre"
                        />
                        <ErrorMessage error={errors.secretariat} />
                    </div>
                </div>
            </section>
        </>
    )
}