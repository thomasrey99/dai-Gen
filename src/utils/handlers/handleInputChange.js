import { validations } from "@/utils/validations";

const handleInputChange = (form, setForm, setErrors) => (input) => {
  let name, value;
  if (typeof input === "object" && input?.target) {
    name = input.target.name;
    value = input.target.value;
  } else if (input?.name !== undefined) {
    name = input.name;
    value = input.value;
  } else if (input?.day && input?.month && input?.year) {
    const updatedForm = { ...form, eventDate: input };
    setForm(updatedForm);
    validateField("eventDate", input, setErrors, updatedForm);
    return;
  } else {
    return;
  }

  const upperValue = typeof value === "string" ? value.toUpperCase() : value;

  const nestedPaths = {
    colaborationFirm: ["colabFirmLp", "colabFirmNames", "colabFirmLastNames", "colabFirmHierarchy"],
    colaborationWatch: ["colabWatchLp", "colabWatchNames", "colabWatchLastNames", "colabWatchHierarchy"],
    rangeTime: ["initTime", "endTime"],
    colaboration: ["cover", "summaryNum"],
    interveningJustice: ["justice", "fiscal", "secretariat"],
  };

  const regLegalFields = [
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

  // Validación para persona lesionada
  if (["injuredDni", "injuredName", "injuredLastName"].includes(name)) {
    if (name === "injuredDni" && (value === "" || !/^\d+$/.test(value))) return;

    const updatedForm = {
      ...form,
      injured: {
        ...form.injured,
        [name]: name === "injuredDni" ? value : upperValue,
      },
    };

    setForm(updatedForm);
    validateField(name, value, setErrors, updatedForm);
    return;
  }

  let updatedForm = { ...form };

  for (const [group, fields] of Object.entries(nestedPaths)) {
    if (fields.includes(name)) {
      if (group === "interveningJustice") {
        updatedForm = {
          ...form,
          interveningJustice: {
            ...form.interveningJustice,
            [name]: value,
          },
        };
      } else if (group === "colaboration") {
        // campos planos como cover, summaryNum
        updatedForm = {
          ...form,
          colaboration: {
            ...form.colaboration,
            [name]: value,
          },
        };
      } else {
        // objetos anidados como colaborationFirm, colaborationWatch, rangeTime
        updatedForm = {
          ...form,
          colaboration: {
            ...form.colaboration,
            [group]: {
              ...(form.colaboration[group] || {}),
              [name]: value,
            },
          },
        };
      }

      setForm(updatedForm);
      validateField(name, value, setErrors, updatedForm);
      return;
    }
  }

  // Campo plano
  updatedForm = {
    ...form,
    [name]: value,
  };

  setForm(updatedForm);
  validateField(name, value, setErrors, updatedForm);

  // Si se cambia el tipo de intervención
  if (name === "typeOfIntervention") {
    if (upperValue === "REG LEGALES") {
      const newErrors = {};
      regLegalFields.forEach(field => {
        const currentValue = getFieldValue(field, updatedForm);
        const errorObj = validations(field, currentValue, updatedForm);
        if (errorObj[field]) {
          newErrors[field] = errorObj[field];
        }
      });
      setErrors(prev => ({
        ...prev,
        ...newErrors,
      }));
    } else {
      setErrors(prev => {
        const updatedErrors = { ...prev };
        regLegalFields.forEach(field => {
          delete updatedErrors[field];
        });
        return updatedErrors;
      });
    }
  }
};

const getFieldValue = (field, form) => {
  const colaboration = form.colaboration || {};
  const firm = colaboration.colaborationFirm || {};
  const watch = colaboration.colaborationWatch || {};
  const range = colaboration.rangeTime || {};

  if (firm[field] !== undefined) return firm[field];
  if (watch[field] !== undefined) return watch[field];
  if (range[field] !== undefined) return range[field];
  if (colaboration[field] !== undefined) return colaboration[field];
  if (form[field] !== undefined) return form[field];
  return "";
};

const validateField = (name, value, setErrors, form) => {
  const validationErrors = validations(name, value, form);
  setErrors(prev => ({
    ...prev,
    [name]: validationErrors[name],
  }));
};

export default handleInputChange;
