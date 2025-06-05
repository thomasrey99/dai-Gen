export const validations = (name, value) => {
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

  if (requiredFields.includes(name)) {
    errors[name] = value.trim().length === 0 ? "Campo requerido" : "";
  }

  return errors;
};
