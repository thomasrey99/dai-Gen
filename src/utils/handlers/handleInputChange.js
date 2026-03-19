const handleInputChange = (setForm) => (inputOrInputs) => {
  const inputs = Array.isArray(inputOrInputs) ? inputOrInputs : [inputOrInputs];

  setForm(prev => {
    let updatedForm = {
      ...prev,
      injured: {
        ...prev.injured,
        vehicle: { ...prev.injured?.vehicle }
      },
      colaboration: {
        ...prev.colaboration,
        colaborationFirm: { ...prev.colaboration?.colaborationFirm },
        colaborationWatch: { ...prev.colaboration?.colaborationWatch },
        rangeTime: { ...prev.colaboration?.rangeTime },
      },
      interveningJustice: { ...prev.interveningJustice },
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

      // 🚗 VEHICLE
      if (vehicleFields.includes(name)) {
        updatedForm.injured.vehicle[name] = upperValue;
        continue;
      }

      // 👤 INJURED
      if (["injuredDni", "injuredName", "injuredLastName"].includes(name)) {
        if (name === "injuredDni" && (value === "" || !/^\d+$/.test(value))) continue;
        updatedForm.injured[name] = name === "injuredDni" ? value : upperValue;
        continue;
      }

      // 🧩 NESTED FIELDS
      let isNested = false;

      for (const [group, fields] of Object.entries(nestedPaths)) {
        if (fields.includes(name)) {
          isNested = true;

          if (group === "interveningJustice") {
            if (["fiscal", "secretariat"].includes(name) && typeof value === "string") {
              updatedForm[group][name] = value.toUpperCase();
            } else {
              updatedForm[group][name] = value;
            }
          } else if (group === "colaboration") {
            updatedForm[group][name] = value;
          } else {
            updatedForm.colaboration[group][name] = value;
          }

          break;
        }
      }

      if (isNested) continue;

      // 🔠 CAMPOS EN MAYÚSCULA
      const toUpperFields = [
        "area",
        "typeOfIntervention",
        "number",
        "operator",
        "intervener",
        "modalitie",
        "jurisdiction",
      ];

      updatedForm[name] = toUpperFields.includes(name) ? upperValue : value;

      // 🧹 LIMPIEZA SI NO ES REG LEGALES
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

    return updatedForm;
  });
};

export default handleInputChange;