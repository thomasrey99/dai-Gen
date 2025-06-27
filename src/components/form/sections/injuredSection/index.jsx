import ErrorMessage from "@/components/errorMessage";
import InputText from "@/components/inputs/inputText";

export default function InjuredSection({
    form,
    errors,
    handleChange
}) {
    return (
        <>
            {/* Primera fila: 3 inputs */}
            <p
                className='my-6 text-warning font-bold'
            >Datos personales</p>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <InputText
                        rule={"Nombre del damnificado"}
                        name={"injuredName"}
                        label={"Nombre"}
                        handleChange={handleChange}
                        value={form.injured.injuredName}
                    />
                    <ErrorMessage error={errors.injuredName} />
                </div>
                <div>
                    <InputText
                        rule={"Apellido del damnificado"}
                        name={"injuredLastName"}
                        label={"Apellido"}
                        handleChange={handleChange}
                        value={form.injured.injuredLastName}
                        placeholder={"Ingresar apellido"}
                    />
                    <ErrorMessage error={errors.injuredLastName} />
                </div>
                <div>
                    <InputText
                        rule={"Dni del damnificado"}
                        name={"injuredDni"}
                        label={"DNI"}
                        handleChange={handleChange}
                        value={form.injured.injuredDni}
                    />
                    <ErrorMessage error={errors.injuredDni} />
                </div>
            </section>

            {/* Segunda fila: 4 inputs nuevos */}
            <p
                className='my-6 text-warning font-bold'
            >Vehiculo (si hay)</p>
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

                <div>
                    <InputText
                        rule={"Marca del vehiculo: debe estar en MAYUSCULA"}
                        name={"brand"}
                        label={"Marca"}
                        handleChange={handleChange}
                        value={form.injured.vehicle.brand || ""}
                    />
                    <ErrorMessage error={errors.injuredVehicleBrand} />
                </div>
                <div>
                    <InputText
                        rule={"Modelo del vehiculo: debe estar en MAYUSCULA"}
                        name={"model"}
                        label={"Modelo"}
                        handleChange={handleChange}
                        value={form.injured.vehicle.model || ""}
                    />
                    <ErrorMessage error={errors.injuredVehicleModel} />
                </div>
                <div>
                    <InputText
                        rule={"Color del vehiculo: debe estar en MAYUSCULA"}
                        name={"color"}
                        label={"Color"}
                        handleChange={handleChange}
                        value={form.injured.vehicle.color || ""}
                    />
                    <ErrorMessage error={errors.injuredVehicleColor} />
                </div>
                <div>
                    <InputText
                        rule={"Dominio: debe estar en MAYUSCULA"}
                        name={"domain"}
                        label={"Dominio"}
                        handleChange={handleChange}
                        value={form.injured.vehicle.domain || ""}
                    />
                    <ErrorMessage error={errors.injuredVehicleDomain} />
                </div>
            </section>
        </>
    );
}
