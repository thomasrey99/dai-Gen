'use client';

import ErrorMessage from "@/components/errorMessage";
import InputText from "@/components/inputs/inputText";

export default function InjuredSection({ form, errors, handleChange }) {
  return (
    <>
      {/* Datos personales */}
      <p className="my-6 text-warning font-semibold text-lg border-b border-warning/50 pb-1">Datos personales</p>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <InputText
            rule={"Nombre del damnificado"}
            name={"injuredName"}
            label={"Nombre"}
            handleChange={handleChange}
            value={form.injured.injuredName}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
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
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
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
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
          />
          <ErrorMessage error={errors.injuredDni} />
        </div>
      </section>

      {/* Vehículo */}
      <p className="my-6 text-warning font-semibold text-lg border-b border-warning/50 pb-1">Vehículo (si hay)</p>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div>
          <InputText
            rule={"Marca del vehiculo: debe estar en MAYUSCULA"}
            name={"brand"}
            label={"Marca"}
            handleChange={handleChange}
            value={form.injured.vehicle.brand || ""}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
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
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
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
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
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
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
          />
          <ErrorMessage error={errors.injuredVehicleDomain} />
        </div>
      </section>
    </>
  );
}
