'use client';
import AutocompleteInput from "@/components/inputs/autocomplete";
import InputText from "@/components/inputs/inputText";
import ErrorMessage from "@/components/errorMessage";
import { areasList } from "@/utils/data/areas";
import { typesOfInterventionList } from "@/utils/data/typeOfInterventions";
import { originsList } from "@/utils/data/origins";

export default function EventSection({ form, errors, handleChange }) {
  return (
    <>
      <section className={`grid grid-cols-1 md:${form.typeOfIntervention == "SAE" ? "grid-cols-4": "grid-cols-3"} gap-6`}>
        <div>
          <label>Area</label>
          <AutocompleteInput
            isRequired
            error={errors.area}
            rule="DAI / SARIM / DAI Y SARIM"
            label="Área"
            data={areasList}
            name="area"
            setValue={handleChange}
            value={form.area}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
          />
          <ErrorMessage error={errors.area} />
        </div>

        <div>
          <label>Tipo de  intervencion</label>
          <AutocompleteInput
            isRequired
            error={errors.typeOfIntervention}
            rule="SAE / REG LEGALES / V.S.I / P.J. / PRENSA / V.C.A"
            label="Tipo de visualización"
            data={typesOfInterventionList}
            name="typeOfIntervention"
            setValue={handleChange}
            value={form.typeOfIntervention}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
          />
          <ErrorMessage error={errors.typeOfIntervention} />
        </div>

        <div>
          <label>Nombre / N°</label>
          <InputText
            isRequired
            error={errors.number}
            rule="Nº de SAE/REG LEGALES o Nombre"
            name="number"
            label="Nro / Nombre"
            handleChange={handleChange}
            value={form.number}
            placeholder="Ingresar número"
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.number} />
        </div>
        {
          form.typeOfIntervention == "SAE"
          &&
          (
            <div>
              <label>Origen</label>
              <AutocompleteInput
                isRequired
                error={errors.origin}
                rule="SAE / CMU / SISEP"
                label="Origen"
                data={originsList}
                name="origin"
                setValue={handleChange}
                value={form.origin}
                className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
              />
              <ErrorMessage error={errors.origin} />
            </div>
          )
        }
      </section>
    </>
  );
}
