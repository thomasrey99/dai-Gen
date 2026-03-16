import { areasList } from "../data/areas";
import { originsList } from "../data/origins";
import { typesOfInterventionList } from "../data/typeOfInterventions";

export const validations = (name, value, form = {}) => {
  const errors = {};

  const requiredFields = [
    "area",
    "typeOfIntervention",
    "number",
    "eventDate",
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
    "summaryNum",
  ];

  const isRequired =
    requiredFields.includes(name) ||
    (name === "callTime" && form?.typeOfIntervention !== "REG LEGALES") ||
    (name === "origin" && form?.typeOfIntervention === "SAE") ||
    (form?.typeOfIntervention === "REG LEGALES" &&
      requiredIfRegLegales.includes(name));

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
      const valStr = typeof value === "string" ? value : "";
      errors[name] = valStr.trim() === "" ? "Campo requerido" : "";
    }
  }

  // Validaciones específicas
  switch (name) {
    case "area": {
      const valStr = typeof value === "string" ? value.trim() : "";
      if (valStr && !areasList.includes(valStr)) {
        const areas = areasList.join(", ");
        errors[name] = "Opción inválida, disponibles: " + areas;
      }
      break;
    }
    case "typeOfIntervention": {
      const valStr = typeof value === "string" ? value.trim() : "";
      if (valStr && !typesOfInterventionList.includes(valStr)) {
        const types = typesOfInterventionList.join(", ");
        errors[name] = "Opción inválida, disponibles: " + types;
      }
      break;
    }
    case "origin": {
      const valStr = typeof value === "string" ? value.trim() : "";
      if (valStr && !originsList.includes(valStr)) {
        const origins = originsList.join(", ");
        errors[name] = "Opción inválida, disponibles: " + origins;
      }
      break;
    }

    case "operator":
    case "intervener":
      if (value && !/^[A-Z\s]+$/.test(value)) {
        errors[name] = "Solo se permiten letras mayúsculas";
      }
      break;

    case "fiscal":
    case "secretariat":
      if (value && !/^(DR\.|DRA\.)\s[A-ZÁÉÍÓÚÑ\s]+$/.test(value)) {
        errors[name] =
          "Debe comenzar con 'DR.' o 'DRA.' y contener solo mayúsculas";
      }
      break;

    case "cover":
    case "modalitie":
      if (value && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\/.\s()º-]+$/.test(value)) {
        errors[name] =
          "Solo se permiten letras, números, '()', 'º' '/' y '.'";
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