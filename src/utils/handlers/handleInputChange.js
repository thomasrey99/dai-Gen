const handleInputChange = (form, setForm) => (inputOrInputs) => {
  const inputs = Array.isArray(inputOrInputs) ? inputOrInputs : [inputOrInputs];

  // Clonamos estructura completa para mantener valores previos
  let updatedForm = {
    ...form,
    injured: { ...form.injured, vehicle: { ...form.injured?.vehicle } },
    colaboration: {
      ...form.colaboration,
      colaborationFirm: { ...form.colaboration?.colaborationFirm },
      colaborationWatch: { ...form.colaboration?.colaborationWatch },
      rangeTime: { ...form.colaboration?.rangeTime },
    },
    interveningJustice: { ...form.interveningJustice },
  };

  const nestedPaths = {
    colaborationFirm: ["colabFirmLp", "colabFirmNames", "colabFirmLastNames", "colabFirmHierarchy"],
    colaborationWatch: ["colabWatchLp", "colabWatchNames", "colabWatchLastNames", "colabWatchHierarchy"],
    rangeTime: ["initTime", "endTime"],
    colaboration: ["cover", "summaryNum"],
    interveningJustice: ["justice", "fiscal", "secretariat"],
  };

  const regLegalFields = [
    "colabFirmHierarchy", "colabFirmLp", "colabFirmNames", "colabFirmLastNames",
    "colabWatchHierarchy", "colabWatchLp", "colabWatchNames", "colabWatchLastNames",
    "initTime", "endTime", "cover", "summaryNum"
  ];

  const vehicleFields = ["brand", "model", "color", "domain"];

  for (const input of inputs) {
    let name, value;

    if (typeof input === "object" && input?.target) {
      name = input.target.name;
      value = input.target.value;
    } else if (input?.name !== undefined) {
      name = input.name;
      value = input.value;
    } else if (input?.day && input?.month && input?.year) {
      updatedForm.eventDate = input;
      continue;
    } else {
      continue;
    }

    const upperValue = typeof value === "string" ? value.toUpperCase() : value;

    if (vehicleFields.includes(name)) {
      updatedForm.injured.vehicle[name] = upperValue;
      continue;
    }

    if (["injuredDni", "injuredName", "injuredLastName"].includes(name)) {
      if (name === "injuredDni" && (value === "" || !/^\d+$/.test(value))) continue;
      updatedForm.injured[name] = name === "injuredDni" ? value : upperValue;
      continue;
    }

    let isNested = false;
    for (const [group, fields] of Object.entries(nestedPaths)) {
      if (fields.includes(name)) {
        isNested = true;
        if (group === "interveningJustice") {
          updatedForm[group][name] = value;
        } else if (group === "colaboration") {
          updatedForm[group][name] = value;
        } else {
          updatedForm.colaboration[group][name] = value;
        }
        break;
      }
    }
    if (isNested) continue;

    const toUpperFields = [
      "area", "typeOfIntervention", "number",
      "operator", "intervener", "modalitie", "jurisdiction"
    ];
    updatedForm[name] = toUpperFields.includes(name) ? upperValue : value;

    // Limpieza de campos cuando typeOfIntervention cambia y no es REG LEGALES
    if (name === "typeOfIntervention") {
      if (upperValue !== "REG LEGALES") {
        for (const field of regLegalFields) {
          if (field in updatedForm.colaboration.colaborationFirm) {
            updatedForm.colaboration.colaborationFirm[field] = "";
          } else if (field in updatedForm.colaboration.colaborationWatch) {
            updatedForm.colaboration.colaborationWatch[field] = "";
          } else if (field in updatedForm.colaboration.rangeTime) {
            updatedForm.colaboration.rangeTime[field] = "";
          } else if (field in updatedForm.colaboration) {
            updatedForm.colaboration[field] = "";
          }
        }
      }
    }
  }

  setForm(updatedForm);
};

export default handleInputChange;
