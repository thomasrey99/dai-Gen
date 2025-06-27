import Toast from '@/components/Toast';

export function clearForm({
  onOpenChange,
  setForm,
  setErrors,
  fileInputRef,
  setPdfURL,
  setFileName,
  setDataObject,
}) {
  try {
    onOpenChange(false);

    setForm({
      area: null,
      typeOfIntervention: null,
      number: null,
      injured: {
        injuredName: "",
        injuredLastName: "",
        injuredDni: "",
        vehicle: {
          brand: "",
          model: "",
          color: "",
          domain: ""
        }
      },
      colaboration: {
        colaborationFirm: {
          colabFirmHierarchy: "",
          colabFirmLp: "",
          colabFirmNames: "",
          colabFirmLastNames: ""
        },
        colaborationWatch: {
          colabWatchHierarchy: "",
          colabWatchLp: "",
          colabWatchNames: "",
          colabWatchLastNames: ""
        },
        rangeTime: {
          initTime: "",
          endTime: ""
        },
        cover: "",
        summaryNum: "",
      },
      eventDate: null,
      callTime: '',
      direction: '',
      placeId: "",
      jurisdiction: '',
      interveningJustice: {
        justice: '',
        fiscal: '',
        secretariat: '',
      },
      modalitie: '',
      operator: '',
      intervener: '',
      review: ''
    });

    setErrors({
      area: "Campo requerido",
      typeOfIntervention: "Campo requerido",
      number: "Campo requerido",
      eventDate: "Campo requerido",
      callTime: "Campo requerido",
      direction: "Campo requerido",
      modalitie: "Campo requerido",
      operator: "Campo requerido",
      intervener: "Campo requerido",
      review: "Campo requerido",
    });

    if (fileInputRef?.current) fileInputRef.current.value = '';
    setFileName("");
    setPdfURL(null);
    setDataObject(null);

    Toast("success", "Campos limpios!");
  } catch (error) {
    Toast("error", "Error al borrar los campos");
  }
}