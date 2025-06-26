import ErrorMessage from "@/components/errorMessage";
import InputText from "@/components/inputs/inputText";

export default function InjuredSection({
    form,
    errors,
    handleChange
}) {
    return (
        <>
            <section
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <div>
                    <InputText
                        rule={"Nombre del damnificado"}
                        name={"injuredName"}
                        label={"Nombre"}
                        handleChange={handleChange}
                        value={form.injured.injuredName}
                    />
                    <ErrorMessage
                        error={errors.injuredName}
                    />
                </div>
                <div>
                    <InputText
                        rule={"Apellido del damnificado"}
                        name={"injuredLastName"}
                        label={"Apellido"}
                        handleChange={handleChange}
                        value={form.injured.injuredLastName}
                        placeholder={"Ingresar caratula"}
                    />
                    <ErrorMessage
                        error={errors.injuredLastName}
                    />
                </div>
                <div>
                    <InputText
                        rule={"Dni del damnificado"}
                        name={"injuredDni"}
                        label={"Dni"}
                        handleChange={handleChange}
                        value={form.injured.injuredDni}
                    />
                    <ErrorMessage
                        error={errors.injuredDni}
                    />
                </div>
            </section>
        </>
    )
}