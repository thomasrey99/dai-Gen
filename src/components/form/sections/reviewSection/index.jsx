import ErrorMessage from "@/components/errorMessage";
import InputTextArea from "@/components/inputs/textArea";

export default function ReviewSection({
    form,
    errors,
    handleChange
}) {
    return (
        <section>
            <InputTextArea
                isRequired={true}
                error={errors.review}
                label={"Reseña"}
                value={form.review}
                handleChange={handleChange}
                name={"review"}
            />
            <ErrorMessage
                error={errors.review}
            />
        </section>
    )
}