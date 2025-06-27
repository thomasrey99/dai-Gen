import AutocompleteInput from "@/components/inputs/autocomplete";
import ErrorMessage from "@/components/errorMessage";
import InputText from "@/components/inputs/inputText";
import InputTime from "@/components/inputs/inputTime";
import { hierarchiesList } from "@/utils/data/hierarchies";

export default function ColaborationSection({ form, errors, handleChange }) {
  return (
    <>
      <p className="my-6 text-warning font-semibold text-lg border-b border-warning/50 pb-1">
        Oficio
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InputText
            rule={"Caratula que figura en la nota"}
            name={"cover"}
            label={"Caratula"}
            handleChange={handleChange}
            value={form.colaboration.cover}
            placeholder={"Ingresar caratula"}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.cover} />
        </div>

        <div>
          <InputText
            rule={"Nº de sumario que figura en la nota"}
            name={"summaryNum"}
            label={"Nº de sumario"}
            handleChange={handleChange}
            value={form.colaboration.summaryNum}
            placeholder={"Ingresar Nº de sumario"}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.summaryNum} />
        </div>
      </section>

      <p className="my-6 text-warning font-semibold text-lg border-b border-warning/50 pb-1">
        Franja de visualización
      </p>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InputTime
            rule={"Solo tipear hh:mm:ss (se formatea solo)"}
            name={"initTime"}
            value={form.colaboration.rangeTime.initTime}
            label={"Desde"}
            handleChange={handleChange}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.initTime} />
        </div>

        <div>
          <InputTime
            rule={"Solo tipear hh:mm:ss (se formatea solo)"}
            name={"endTime"}
            value={form.colaboration.rangeTime.endTime}
            label={"Hasta"}
            handleChange={handleChange}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.endTime} />
        </div>
      </section>

      <p className="my-6 text-warning font-semibold text-lg border-b border-warning/50 pb-1">
        Personal que firma Nota / Oficio
      </p>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <AutocompleteInput
            rule={"Jerarquia del personal que firmo la nota"}
            label="Jerarquia"
            data={hierarchiesList}
            name={"colabFirmHierarchy"}
            setValue={handleChange}
            value={form.colaboration.colaborationFirm.colabFirmHierarchy}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
          />
          <ErrorMessage error={errors.colabFirmHierarchy} />
        </div>

        <div>
          <InputText
            rule={"L.P. del personal que firmo la nota"}
            error={errors.colabFirmLp}
            name={"colabFirmLp"}
            label={"L.P."}
            handleChange={handleChange}
            value={form.colaboration.colaborationFirm.colabFirmLp}
            placeholder={"Ingresar L.P."}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.colabFirmLp} />
        </div>

        <div>
          <InputText
            rule={"Nombres del personal que firmo la nota"}
            name={"colabFirmNames"}
            label={"Nombres"}
            handleChange={handleChange}
            value={form.colaboration.colaborationFirm.colabFirmNames}
            placeholder={"Ingresar nombres"}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.colabFirmNames} />
        </div>

        <div>
          <InputText
            rule={"Apellidos del personal que firmo la nota"}
            name={"colabFirmLastNames"}
            label={"Apellidos"}
            handleChange={handleChange}
            value={form.colaboration.colaborationFirm.colabFirmLastNames}
            placeholder={"Ingresar apellidos"}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.colabFirmLastNames} />
        </div>
      </section>

      <p className="my-6 text-warning font-semibold text-lg border-b border-warning/50 pb-1">
        Personal que visualiza
      </p>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <AutocompleteInput
            rule={"Jerarquia del personal que va a visualizar"}
            label="Jerarquia"
            data={hierarchiesList}
            name={"colabWatchHierarchy"}
            value={form.colaboration.colaborationWatch.colabWatchHierarchy}
            setValue={handleChange}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md transition"
          />
          <ErrorMessage error={errors.colabWatchHierarchy} />
        </div>

        <div>
          <InputText
            rule={"L.P. del personal que va a visualizar"}
            error={errors.colabWatchLp}
            name={"colabWatchLp"}
            label={"L.P."}
            handleChange={handleChange}
            value={form.colaboration.colaborationWatch.colabWatchLp}
            placeholder={"Ingresar L.P."}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.colabWatchLp} />
        </div>

        <div>
          <InputText
            rule={"Nombres del personal que va a visualizar"}
            name={"colabWatchNames"}
            label={"Nombres"}
            handleChange={handleChange}
            value={form.colaboration.colaborationWatch.colabWatchNames}
            placeholder={"Ingresar nombres"}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.colabWatchNames} />
        </div>

        <div>
          <InputText
            rule={"Apellidos del personal que va a visualizar"}
            name={"colabWatchLastNames"}
            label={"Apellidos"}
            handleChange={handleChange}
            value={form.colaboration.colaborationWatch.colabWatchLastNames}
            placeholder={"Ingresar apellidos"}
            className="bg-black/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-white placeholder-gray-400 rounded-md px-3 py-2 transition"
          />
          <ErrorMessage error={errors.colabWatchLastNames} />
        </div>
      </section>
    </>
  );
}
