'use client';
import { modalitiesList } from '../../../public/data/modalities';
import { operatorsList } from '../../../public/data/operators';
import { intervenersList } from '../../../public/data/interveners';
import { areasList } from '../../../public/data/areas';
import { typesOfInterventionList } from '../../../public/data/typeOfInterventions';
import { jurisdictionsList } from '../../../public/data/jurisdictions';
import { justicesList } from '../../../public/data/justice';
import { hierarchiesList } from "../../../public/data/hierarchies"
import ModalAlert from '../modalAlert';
import AutocompleteInput from '../autocomplete';
import InputText from '../inputs/inputText';
import InputTime from '../inputs/inputTime';
import InputDate from '../inputs/inputDate';
import InputTextArea from '../inputs/textArea';
import { Accordion, AccordionItem, Button, Link, useDisclosure } from "@heroui/react";
import AddressAutocomplete from '../inputPlace';
import Map from '../map';
import ModalConfirm from '../modal';
import { useEffect, useState } from 'react';
import { validations } from '@/utils/validations';
import InputNumber from '../inputs/inputNumber';
import ErrorMessage from '../errorMessage';


export const AnchorIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height="24"
      role="presentation"
      viewBox="0 0 24 24"
      width="24"
      {...props}
    >
      <path
        d="M8.465,11.293c1.133-1.133,3.109-1.133,4.242,0L13.414,12l1.414-1.414l-0.707-0.707c-0.943-0.944-2.199-1.465-3.535-1.465 S7.994,8.935,7.051,9.879L4.929,12c-1.948,1.949-1.948,5.122,0,7.071c0.975,0.975,2.255,1.462,3.535,1.462 c1.281,0,2.562-0.487,3.536-1.462l0.707-0.707l-1.414-1.414l-0.707,0.707c-1.17,1.167-3.073,1.169-4.243,0 c-1.169-1.17-1.169-3.073,0-4.243L8.465,11.293z"
        fill="currentColor"
      />
      <path
        d="M12,4.929l-0.707,0.707l1.414,1.414l0.707-0.707c1.169-1.167,3.072-1.169,4.243,0c1.169,1.17,1.169,3.073,0,4.243 l-2.122,2.121c-1.133,1.133-3.109,1.133-4.242,0L10.586,12l-1.414,1.414l0.707,0.707c0.943,0.944,2.199,1.465,3.535,1.465 s2.592-0.521,3.535-1.465L19.071,12c1.948-1.949,1.948-5.122,0-7.071C17.121,2.979,13.948,2.98,12,4.929z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function Excel({
  setForm,
  form,
  errors,
  setErrors,
  loading,
  setIsLoading,
  fileInputRef,
  setPdfURL,
  setDataObject,
  setFileName
}) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleChange = async (e) => {
    const { name, value } = e.target;
    const upperValue = value.toUpperCase();

    // Manejador especial para campos de "injured"
    if (["injuredDni", "injuredName", "injuredLastName"].includes(name)) {
      if (name === "injuredDni") {
        if (value === "" || !/^\d+$/.test(value)) return; // DNI no válido
        setForm(prev => ({
          ...prev,
          injured: {
            ...prev.injured,
            [name]: value,
          },
        }));
      } else {
        setForm(prev => ({
          ...prev,
          injured: {
            ...prev.injured,
            [name]: upperValue,
          },
        }));
      }
      validateField(name, value);
      return;
    }

    // Mapeo de rutas de campos anidados
    const nestedPaths = {
      colaborationFirm: ["colabFirmLp", "colabFirmNames", "colabFirmLastNames"],
      colaborationWatch: ["colabWatchLp", "colabWatchNames", "colabWatchLastNames"],
      rangeTime: ["initTime", "endTime"],
      colaboration: ["cover", "summaryNum"],
      interveningJustice: ["fiscal", "secretariat"],
    };

    let updated = false;

    // Buscar en qué grupo anidado está el campo
    for (const [group, fields] of Object.entries(nestedPaths)) {
      if (fields.includes(name)) {
        if (group === "colaboration" || group === "rangeTime") {
          setForm(prev => ({
            ...prev,
            colaboration: {
              ...prev.colaboration,
              [group]: {
                ...prev.colaboration[group],
                [name]: upperValue,
              },
            },
          }));
        } else if (group === "colaborationFirm" || group === "colaborationWatch") {
          setForm(prev => ({
            ...prev,
            colaboration: {
              ...prev.colaboration,
              [group]: {
                ...prev.colaboration[group],
                [name]: upperValue,
              },
            },
          }));
        } else {
          // interveningJustice
          setForm(prev => ({
            ...prev,
            interveningJustice: {
              ...prev.interveningJustice,
              [name]: upperValue,
            },
          }));
        }
        updated = true;
        break;
      }
    }

    // Si no está en ningún grupo anidado, actualizar directamente
    if (!updated) {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    validateField(name, value);
  };

  // Validación aislada
  const validateField = (name, value) => {
    const validationErrors = validations(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name],
    }));
  };




  const handleAutocompleteChange = async (name, value) => {
    // Aplicar uppercase salvo para los dos campos especiales
    const shouldUppercase = name !== "colabFirmHierarchy" && name !== "colabWatchHierarchy";
    const transformedValue = shouldUppercase ? value.toUpperCase() : value;

    let updatedForm = { ...form };

    if (name === "colabFirmHierarchy") {
      updatedForm = {
        ...form,
        colaboration: {
          ...form.colaboration,
          colaborationFirm: {
            ...form.colaboration.colaborationFirm,
            [name]: transformedValue,
          },
        },
      };
    } else if (name === "colabWatchHierarchy") {
      updatedForm = {
        ...form,
        colaboration: {
          ...form.colaboration,
          colaborationWatch: {
            ...form.colaboration.colaborationWatch,
            [name]: transformedValue,
          },
        },
      };
    } else if (name === "justice") {
      updatedForm = {
        ...form,
        interveningJustice: {
          ...form.interveningJustice,
          [name]: transformedValue,
        },
      };
    } else {
      updatedForm = {
        ...form,
        [name]: transformedValue,
      };
    }

    setForm(updatedForm);

    const validationErrors = validations(name, transformedValue);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: validationErrors[name],
    }));
  };

  const handleDateChange = (date) => {
    setForm({
      ...form,
      eventDate: date
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formattedForm = {
      ...form,
      eventDate: `${form.eventDate.day}-${form.eventDate.month}-${form.eventDate.year}`,
    };

    const res = await fetch(process.env.NEXT_PUBLIC_MODIFY_EXCEL_ROUTE, {
      method: 'POST',
      body: JSON.stringify(formattedForm),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      setIsLoading(false);
      ModalAlert('error', 'Error al generar el archivo');
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.typeOfIntervention}-${form.number}.xlsx`;
    link.click();
    setIsLoading(false);
  };

  const handleClear = () => {
    try {
      onOpenChange(false)
      setForm({
        area: null,
        typeOfIntervention: null,
        number: null,
        injured: {
          injuredName: "",
          injuredLastName: "",
          injuredDni: ""
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
        review: '',
      });

      setErrors(
        {
          area: "Campo requerido",
          typeOfIntervention: "Campo requerido",
          number: "Campo requerido",
          eventDate: "Campo requerido",
          callTime: "Campo requerido",
          direction: "Campo requerido",
          modalitie: "Campo requerido",
          operator: "Campo requerido",
          intervener: "Campo requerido",
          review: "Campo requerido"
        }
      )

      if (fileInputRef.current) fileInputRef.current.value = '';
      setFileName("")
      setPdfURL(null);
      setDataObject(null);
      ModalAlert("success", "Campos limpios!")
    } catch (error) {
      ModalAlert("error", "Error al borrar los campos")
    }
  };



  const hasFormErrors = (errors) => {
    return Object.values(errors).some(error => typeof error === 'string' && error.trim() !== '');
  };

  const incomplete = hasFormErrors(errors);

  return (
    <form
      className="relative overflow-hidden flex flex-col w-full max-w-6xl mx-auto bg-white/5 p-6 gap-6 rounded-xl shadow-lg ring-1 ring-white/10 backdrop-blur-md"
      onSubmit={onSubmit}
    >
      <div className='w-full flex flex-col xl:flex-row justify-between'>
        <h2 className="text-lg xl:text-3xl font-bold text-white tracking-tight pb-2">Formulario de Visualización</h2>
        <Link className='font-bold ' isExternal showAnchorIcon anchorIcon={<AnchorIcon />} color='warning' href="https://drive.google.com/file/d/1XcEme9ZLJu2l16T_-qrHDhq70zLtrXep/view?usp=sharing">Instructivo</Link>
      </div>

      <Accordion
        defaultExpandedKeys={['review']}
        showDivider={true}
        className="shadow-accordion-accent custom-accordion"
        selectionMode="multiple">

        <AccordionItem
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.area || errors.typeOfIntervention || errors.number) ? "Revisar" : ""}
          aria-label="Area / Tipo / Nº"
          title="Area / Tipo / Nº"
          key={"Area / Tipo / Nº"}>
          {/* GRUPO 1 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <AutocompleteInput isRequired={true} error={errors.area} rule={"DAI / SARIM / DAI Y SARIM"} label='Area' data={areasList} name={"area"} setValue={handleAutocompleteChange} value={form.area} />
              <ErrorMessage error={errors.area} />
            </div>

            <div>
              <AutocompleteInput isRequired={true} error={errors.typeOfIntervention} rule={"SAE / REG LEGALES / V.S.I / P.J. / PRENSA / V.C.A"} label='Tipo de visualizacion' data={typesOfInterventionList} name={"typeOfIntervention"} setValue={handleAutocompleteChange} value={form.typeOfIntervention} />
              <ErrorMessage error={errors.typeOfIntervention} />
            </div>

            <div>
              <InputText isRequired={true} error={errors.number} rule={"Nº de SAE/REG LEGALES o Nombre"} name={"number"} label={"Nro / Nombre"} handleChange={handleChange} value={form.number} placeholder={"Ingresar numero"} />
              <ErrorMessage error={errors.number} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem
          aria-label="Visualizador / interventor"
          title="Visualizador / interventor"
          key={"Visualizador / interventor"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.operator || errors.intervener) ? "Revisar" : ""}
        >
          {/* GRUPO 2 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AutocompleteInput isRequired={true} error={errors.operator} rule={"Seleccionar o tipear apellido del visualizador"} label='Visualizador' data={operatorsList} name={"operator"} setValue={handleAutocompleteChange} value={form.operator} />
              <ErrorMessage error={errors.operator} />
            </div>

            <div>
              <AutocompleteInput isRequired={true} error={errors.intervener} rule={"Seleccionar o tipear apellido del interventor"} label='Interventor' data={intervenersList} name={"intervener"} setValue={handleAutocompleteChange} value={form.intervener} />
              <ErrorMessage error={errors.intervener} />
            </div>
          </section>
        </AccordionItem>

        {/*Grupo damnificado*/}
        <AccordionItem
          aria-label="Datos del damnificado"
          title="Datos del damnificado"
          key={"Datos del damnificado"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.injuredName || errors.injuredLastName || errors.injuredDni) ? "Revisar" : ""}
        >
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <InputText rule={"Nombre del damnificado"} name={"injuredName"} label={"Nombre"} handleChange={handleChange} value={form.injured.injuredName} />
              <ErrorMessage error={errors.injuredName} />
            </div>
            <div>
              <InputText rule={"Apellido del damnificado"} name={"injuredLastName"} label={"Apellido"} handleChange={handleChange} value={form.injured.injuredLastName} placeholder={"Ingresar caratula"} />
              <ErrorMessage error={errors.injuredLastName} />
            </div>
            <div>
              <InputText rule={"Dni del damnificado"} name={"injuredDni"} label={"Dni"} handleChange={handleChange} value={form.injured.injuredDni} />
              <ErrorMessage error={errors.injuredDni} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem
          label="Colaboracion"
          title="Colaboracion"
          isDisabled={form.typeOfIntervention !== "REG LEGALES"} key={"Colaboracion"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.cover || errors.summaryNum || errors.initTime || errors.endTime || errors.colabFirmHierarchy || errors.colabFirmLp || errors.colabFirmNames || errors.colabFirmLastNames || errors.colabWatchHierarchy || errors.colabWatchLp || errors.colabWatchNames || errors.colabWatchLastNames) ? "Revisar" : ""}
        >
          {/*Grupo de colaboracion*/}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputText rule={"Caratula que figura en la nota"} name={"cover"} label={"Caratula"} handleChange={handleChange} value={form.colaboration.cover} placeholder={"Ingresar caratula"} />
              <ErrorMessage error={errors.cover} />
            </div>

            <div>
              <InputText rule={"Nº de sumario que figura en la nota"} name={"summaryNum"} label={"Nº de sumario"} handleChange={handleChange} value={form.colaboration.summaryNum} placeholder={"Ingresar Nº de sumario"} />
              <ErrorMessage error={errors.summaryNum} />
            </div>
          </section>
          <p className='my-6 text-warning font-bold'>Franja de visualizacion</p>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputTime rule={"Solo tipear hh:mm:ss (se formatea solo)"} name={"initTime"} value={form.colaboration.rangeTime.initTime} label={"Desde"} handleChange={handleChange} />
              <ErrorMessage error={errors.initTime} />
            </div>

            <div>
              <InputTime rule={"Solo tipear hh:mm:ss (se formatea solo)"} name={"endTime"} value={form.colaboration.rangeTime.endTime} label={"Hasta"} handleChange={handleChange} />
              <ErrorMessage error={errors.endTime} />
            </div>
          </section>
          <p className='my-6 text-warning font-bold'>Personal que firma Nota / Oficio</p>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <AutocompleteInput rule={"Jerarquia del personal que firmo la nota"} label='Jerarquia' data={hierarchiesList} name={"colabFirmHierarchy"} setValue={handleAutocompleteChange} value={form.colaboration.colaborationFirm.colabFirmHierarchy} />
              <ErrorMessage error={errors.colabFirmHierarchy} />
            </div>

            <div>
              <InputText rule={"L.P. del personal que firmo la nota"} error={errors.colabFirmLp} name={"colabFirmLp"} label={"L.P."} handleChange={handleChange} value={form.colaboration.colaborationFirm.colabFirmLp} placeholder={"Ingresar L.P."} />
              <ErrorMessage error={errors.colabFirmLp} />
            </div>
            <div>
              <InputText rule={"Nombres del personal que firmo la nota"} name={"colabFirmNames"} label={"Nombres"} handleChange={handleChange} value={form.colaboration.colaborationFirm.colabFirmNames} placeholder={"Ingresar nombres"} />
              <ErrorMessage error={errors.colabFirmNames} />
            </div>
            <div>
              <InputText rule={"Apellidos del personal que firmo la nota"} name={"colabFirmLastNames"} label={"Apellidos"} handleChange={handleChange} value={form.colaboration.colaborationFirm.colabFirmLastNames} placeholder={"Ingresar apellidos"} />
              <ErrorMessage error={errors.colabFirmLastNames} />
            </div>
          </section>
          <p className='my-6 text-warning font-bold'>Personal que visualiza</p>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <AutocompleteInput rule={"Jerarquia del personal que va a visualizar"} label='Jerarquia' data={hierarchiesList} name={"colabWatchHierarchy"} setValue={handleAutocompleteChange} value={form.colaboration.colaborationWatch.colabWatchHierarchy} />
              <ErrorMessage error={errors.colabWatchHierarchy} />
            </div>

            <div>
              <InputText rule={"L.P. del personal que va a visualizar"} error={errors.colabWatchLp} name={"colabWatchLp"} label={"L.P."} handleChange={handleChange} value={form.colaboration.colaborationWatch.colabWatchLp} placeholder={"Ingresar L.P."} />
              <ErrorMessage error={errors.colabWatchLp} />
            </div>
            <div>
              <InputText rule={"Nombres del personal que va a visualizar"} name={"colabWatchNames"} label={"Nombres"} handleChange={handleChange} value={form.colaboration.colaborationWatch.colabWatchNames} placeholder={"Ingresar nombres"} />
              <ErrorMessage error={errors.colabWatchNames} />
            </div>
            <div>
              <InputText rule={"Apellidos del personal que va a visualizar"} name={"colabWatchLastNames"} label={"Apellidos"} handleChange={handleChange} value={form.colaboration.colaborationWatch.colabWatchLastNames} placeholder={"Ingresar apellidos"} />
              <ErrorMessage error={errors.colabWatchLastNames} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem
          aria-label="Operador / interventor"
          title="Direccion / fecha / hora"
          key={"Direccion / fecha / hora"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.direction || errors.eventDate || errors.callTime) ? "Revisar" : ""}
        >
          {/* GRUPO 3 */}
          <section className={`grid grid-cols-1 ${form.typeOfIntervention === "REG LEGALES" ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}>
            <div>
              {/*<InputText name={"direction"} label={"Direccion"} handleChange={handleChange} value={form.direction} placeholder={"Ingresar direccion"} />*/}
              <AddressAutocomplete rule={"Texto capitalizado. (Ej: Monteagudo 1269 o Avenida Corrientes y Avenida 9 de Julio)"} setValue={handleChange} value={form.direction} />
              <ErrorMessage error={errors.direction} />
            </div>
            <div>
              <InputDate rule={"Solo tipear dd/mm/aaaa (se formatea solo a dd-mm-aaaa)"} value={form.eventDate} handleChange={handleDateChange} label={"Fecha del hecho"} />
              <ErrorMessage error={errors.eventDate} />
            </div>

            {
              form.typeOfIntervention !== "REG LEGALES"
              &&
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
                <ErrorMessage error={errors.callTime} />
              </div>
            }
          </section>
          <div className='w-full mt-2'>
            {
              form.placeId && <Map url={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&q=place_id:${form.placeId}`} />
            }
          </div>
        </AccordionItem>
        <AccordionItem
          aria-label="Modalidad / Dependencia"
          title="Modalidad / Dependencia"
          key={"Modalidad / Dependencia"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.modalitie || errors.jurisdiction) ? "Revisar" : ""}
        >
          {/* GRUPO 4 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AutocompleteInput
                isRequired={true}
                error={errors.modalitie}
                rule={"Seleccionar o tipear una modalidad"}
                label='Modalidad'
                data={modalitiesList}
                name={"modalitie"}
                setValue={handleAutocompleteChange}
                value={form.modalitie}
              />
              <ErrorMessage error={errors.modalitie} />
            </div>

            <div>
              <AutocompleteInput
                rule={"Seleccionar o tipear una dependencia"}
                label='Dependencia'
                data={jurisdictionsList}
                name={"jurisdiction"}
                setValue={handleAutocompleteChange}
                value={form.jurisdiction}
              />
              <ErrorMessage error={errors.jurisdiction} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem
          aria-label="Justicia interventora"
          title="Justicia interventora"
          key={"Justicia interventora"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.justice || errors.fiscal || errors.secretariat) ? "Revisar" : ""}
        >
          {/* GRUPO 5 */}
          <section className="flex flex-col md:block">
            <div className="w-full mb-6">
              <AutocompleteInput
                rule={"Seleccionar o tipear la Justicia que intervino"}
                label="Justicia"
                data={justicesList}
                name="justice"
                setValue={handleAutocompleteChange}
                value={form.interveningJustice.justice}
              />
              <ErrorMessage error={errors.justice} />
            </div>

            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-1/2">
                <InputText
                  rule={"Debe estar en mayúscula, con el prefijo DR. o DRA."}
                  error={errors.fiscal}
                  name="fiscal"
                  label="Fiscal a/c"
                  handleChange={handleChange}
                  value={form.interveningJustice.fiscal}
                  placeholder="Ingresar nombre"
                />
                <ErrorMessage error={errors.fiscal} />
              </div>

              <div className="w-full md:w-1/2">
                <InputText
                  rule={"Debe estar en mayúscula, con el prefijo DR. o DRA."}
                  error={errors.secretariat}
                  name="secretariat"
                  label="Secretaría a/c"
                  handleChange={handleChange}
                  value={form.interveningJustice.secretariat}
                  placeholder="Ingresar nombre"
                />
                <ErrorMessage error={errors.secretariat} />
              </div>
            </div>
          </section>

        </AccordionItem>
        <AccordionItem
          aria-label='Reseña'
          title="Reseña"
          key="review"
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.review) ? "Revisar" : ""}
        >
          <div>
            <InputTextArea
              isRequired={true}
              error={errors.review}
              label={"Reseña"}
              value={form.review}
              handleChange={handleChange}
              name={"review"}
            />
            <ErrorMessage error={errors.review} />
          </div>
        </AccordionItem>
      </Accordion>



      {/* BOTONES */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <Button color="primary" variant="ghost" type='submit' isDisabled={incomplete || loading}>
          Generar Excel
        </Button>
        <Button color="success" variant="ghost" onPress={() => { onOpenChange(true) }}>
          Lmpiar campos
        </Button>
      </div>
      <ModalConfirm text={"¿Desea limpiar todos los campos del formulario?"} title={"Limpiar campos"} action={handleClear} actionTitle={"Limpiar"} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
    </form >


  );
}
