import ErrorMessage from "@/components/errorMessage";
import AddressAutocomplete from "@/components/inputs/inputPlace";
import InputDate from "@/components/inputs/inputDate";
import InputTime from "@/components/inputs/inputTime";
import Map from "@/components/map";

export default function TemporaryLocationSection({
    form,
    errors,
    handleChange
}) {
    return (
        <>
            <section
                className={`grid grid-cols-1 ${form.typeOfIntervention === "REG LEGALES"
                    ? "md:grid-cols-2"
                    : "md:grid-cols-3"
                    } gap-6`}
            >
                <div>
                    <AddressAutocomplete
                        rule={"Texto capitalizado. (Ej: Monteagudo 1269 o Avenida Corrientes y Avenida 9 de Julio)"}
                        setValue={handleChange}
                        value={form.direction}
                    />
                    <ErrorMessage
                        error={errors.direction}
                    />
                </div>

                <div>
                    <InputDate
                        rule={"Solo tipear dd/mm/aaaa (se formatea solo a dd-mm-aaaa)"}
                        value={form.eventDate}
                        handleChange={handleChange}
                        label={"Fecha del hecho"}
                    />
                    <ErrorMessage
                        error={errors.eventDate}
                    />
                </div>

                {form.typeOfIntervention !== "REG LEGALES" && (
                    <div>
                        <InputTime
                            isRequired={true}
                            error={errors.callTime}
                            rule={"Solo tipear hh:mm:ss (se formatea solo)"}
                            name={"callTime"}
                            value={form.callTime}
                            label={"Hora del llamado"}
                            handleChange={handleChange}
                        />
                        <ErrorMessage
                            error={errors.callTime}
                        />
                    </div>
                )}
            </section>

            <div
                className="w-full mt-2"
            >
                {form.placeId && (
                    <Map
                        url={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&q=place_id:${form.placeId}`}
                    />
                )}
            </div>
        </>
    );
}
