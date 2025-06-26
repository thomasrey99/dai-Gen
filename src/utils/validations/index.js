import { areasList } from "@/utils/data/areas";

export const validations = (name, value, form = {}) => {
  const errors = {};
  console.log("form actual", form)
  const requiredFields = [
    "area",
    "typeOfIntervention",
    "number",
    "eventDate",
    "callTime",
    "direction",
    "modalitie",
    "operator",
    "intervener",
    "review",
  ];

  const requiredIfRegLegales = [
    "colabFirmHierarchy",
    "colabFirmLp",
    "colabFirmNames",
    "colabFirmLastNames",
    "colabWatchHierarchy",
    "colabWatchLp",
    "colabWatchNames",
    "colabWatchLastNames",
    "initTime",
    "endTime",
    "cover",
    "summaryNum"
  ];

  const isRequired =
    requiredFields.includes(name) ||
    (form?.typeOfIntervention === "REG LEGALES" &&
      requiredIfRegLegales.includes(name));

      console.log(isRequired)
  if (isRequired) {
    if (name === "eventDate") {
      const isValidDateObject =
        value &&
        typeof value === "object" &&
        "day" in value &&
        "month" in value &&
        "year" in value;

      errors[name] = isValidDateObject ? "" : "Campo requerido";
    } else {
      errors[name] = (typeof value !== "string" || value.trim() === "")
        ? "Campo requerido"
        : "";
    }
  }

  switch (name) {
    case "area":
      const cleanValue = value.trim();
      if (value && !areasList.includes(cleanValue)) {
        const areas = areasList.join(", ");
        errors[name] = "Opción inválida, disponibles: " + areas;
      }
      break;

    case "operator":
    case "intervener":
      if (value && !/^[A-Z\s]+$/.test(value)) {
        errors[name] = "Solo se permiten letras mayúsculas";
      }
      break;

    case "fiscal":
    case "secretariat":
      if (value && !/^(DR\.|DRA\.)\s[A-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
        errors[name] = "Debe comenzar con 'DR.' o 'DRA.' y contener solo mayúsculas";
      }
      break;

    case "cover":
    case "modalitie":
      if (value && !/^[A-Za-z0-9\/.\s]+$/.test(value)) {
        errors[name] = "Solo se permiten letras, números y '/'";
      }
      break;

    case "colabFirmLp":
    case "colabWatchLp":
      if (value && !/^[0-9.]+$/.test(value)) {
        errors[name] = "Solo se permiten números y punto";
      }
      break;
  }

  return errors;
};
