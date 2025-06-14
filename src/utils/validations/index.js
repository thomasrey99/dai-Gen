import { areasList } from "public/data/areas";

export const validations = (name, value) => {
  const errors = {};
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

  if (requiredFields.includes(name)) {
    errors[name] = value.trim().length === 0 ? "Campo requerido" : "";
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

      if (value && !/^(DR\.|DRA\.)\s?[A-Z\s]+$/.test(value)) {
        errors[name] = "Debe comenzar con 'DR.' o 'DRA.' y contener solo mayúsculas";
      }
      break;

    case "cover":
    case "modalitie":
      if (value && !/^[A-Za-z0-9\/\s]+$/.test(value)) {
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
