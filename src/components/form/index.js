'use client';

import { modalitiesList } from '../../../public/data/modalities';
import { operatorsList } from '../../../public/data/operators';
import { intervenersList } from '../../../public/data/interveners';
import { areasList } from '../../../public/data/areas';
import { typesOfInterventionList } from '../../../public/data/typeOfInterventions';
import { jurisdictionsList } from '../../../public/data/jurisdictions';
import { justicesList } from '../../../public/data/justice';
import ModalAlert from '../modalAlert';
import AutocompleteInput from '../autocomplete';
import InputText from '../inputs/inputText';
import InputTime from '../inputs/inputTime';
import InputDate from '../inputs/inputDate';
import InputTextArea from '../inputs/textArea';
import { Accordion, AccordionItem, Button, Link } from "@heroui/react";


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
  loading,
  setIsLoading,
  fileInputRef,
  setPdfURL,
  setDataObject,
  setFileName
}) {



  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "colabFirmHierarchy" ||
      name === "colabFirmLp" ||
      name === "colabFirmNames" ||
      name === "colabFirmLastNames"
    ) {
      setForm({
        ...form,
        colaborationFirm: {
          ...form.colaborationFirm,
          [name]: value,
        },
      });
      return;
    }

    if (
      name === "colabWatchHierarchy" ||
      name === "colabWatchLp" ||
      name === "colabWatchNames" ||
      name === "colabWatchLastNames"
    ) {
      setForm({
        ...form,
        colaborationWatch: {
          ...form.colaborationWatch,
          [name]: value,
        },
      });
      return;
    }
    if (name === 'fiscal' || name === 'secretariat') {
      setForm({
        ...form,
        interveningJustice: {
          ...form.interveningJustice,
          [name]: value,
        },
      });
      return;
    } else {
      setForm({ ...form, [name]: value });
      return;
    }
  };

  const handleAutocompleteChange = (name, value) => {
    if (name === 'justice') {
      setForm({
        ...form,
        interveningJustice: {
          ...form.interveningJustice,
          [name]: value,
        },
      })
      return;
    } else {
      setForm({
        ...form,
        [name]: value
      })
    }
  }

  const handleDateChange = (date) => {
    setForm({
      ...form,
      eventDate: date
    })
  }

  const handleSubmit = async (e) => {
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
    setForm({
      area: '',
      typeOfIntervention: '',
      number: '',
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
      cover: "",
      summaryNum: "",
      eventDate: null,
      callTime: '',
      direction: '',
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

    if (fileInputRef.current) fileInputRef.current.value = '';
    setFileName("")
    setPdfURL(null);
    setDataObject(null);
  };

  const isFormIncomplete = Object.entries(form).some(([key, value]) => {
    const optionalFields = ['intervener', 'operator', 'interveningJustice', 'jurisdiction', "colaborationFirm", "colaborationWatch", "cover", "summaryNum"];
    if (optionalFields.includes(key)) return false;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some((sub) => typeof sub === 'string' && sub.trim() === '');
    }
    return false;
  });

  return (
    <form
      className="relative overflow-hidden flex flex-col w-full max-w-6xl mx-auto bg-white/5 p-6 gap-6 rounded-xl shadow-lg ring-1 ring-white/10 backdrop-blur-md"
      onSubmit={handleSubmit}
    >
      <div className='w-full flex justify-between'>
        <h2 className="text-3xl font-bold text-white tracking-tight pb-2">Formulario de Visualización</h2>
        <Link className='font-bold ' isExternal showAnchorIcon anchorIcon={<AnchorIcon />} color='danger' href="https://drive.google.com/file/d/1XcEme9ZLJu2l16T_-qrHDhq70zLtrXep/view?usp=sharing">Instructivo</Link>
      </div>

      <Accordion defaultExpandedKeys={['review']} selectionMode="multiple">
        <AccordionItem aria-label="Area / Tipo / Nº" title="Area / Tipo / Nº" value={"Area / Tipo / Nº"}>
          {/* GRUPO 1 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <AutocompleteInput label='Area' data={areasList} name={"area"} setValue={handleAutocompleteChange} value={form.area} />
            </div>

            <div>
              <AutocompleteInput label='Tipo de visualizacion' data={typesOfInterventionList} name={"typeOfIntervention"} setValue={handleAutocompleteChange} value={form.typeOfIntervention} />
            </div>

            <div>
              <InputText name={"number"} label={"Nro / Nombre"} handleChange={handleChange} value={form.number} placeholder={"Ingresar numero"} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem aria-label="Operador / interventor" title="Operador / interventor" value={"Operador / interventor"}>
          {/* GRUPO 2 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AutocompleteInput label='Operador' data={operatorsList} name={"operator"} setValue={handleAutocompleteChange} value={form.operator} />
            </div>

            <div>
              <AutocompleteInput label='interventor' data={intervenersList} name={"intervener"} setValue={handleAutocompleteChange} value={form.intervener} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem label="Colaboracion" title="Colaboracion" isDisabled={form.typeOfIntervention !== "REG LEGALES"} value={"Colaboracion"}>
          {/*Grupo de colaboracion*/}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputText name={"cover"} label={"Caratula"} handleChange={handleChange} value={form.cover} placeholder={"Ingresar caratula"} />
            </div>

            <div>
              <InputText name={"summaryNum"} label={"Nº de sumario"} handleChange={handleChange} value={form.summaryNum} placeholder={"Ingresar Nº de sumario"} />
            </div>
          </section>
          <p className='my-6 text-red-500 font-bold'>Personal que firma</p>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <InputText name={"colabFirmHierarchy"} label={"Jerarquia"} handleChange={handleChange} value={form.colaborationFirm.colabFirmHierarchy} placeholder={"Ingresar jerarquia"} />
            </div>

            <div>
              <InputText name={"colabFirmLp"} label={"L.P."} handleChange={handleChange} value={form.colaborationFirm.colabFirmLp} placeholder={"Ingresar L.P."} />
            </div>
            <div>
              <InputText name={"colabFirmNames"} label={"Nombres"} handleChange={handleChange} value={form.colaborationFirm.colabFirmNames} placeholder={"Ingresar nombres"} />
            </div>
            <div>
              <InputText name={"colabFirmLastNames"} label={"Apellidos"} handleChange={handleChange} value={form.colaborationFirm.colabFirmLastNames} placeholder={"Ingresar apellidos"} />
            </div>
          </section>
          <p className='my-6 text-red-500 font-bold'>Personal que visualiza</p>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <InputText name={"colabWatchHierarchy"} label={"Jerarquia"} handleChange={handleChange} value={form.colaborationWatch.colabWatchHierarchy} placeholder={"Ingresar jerarquia"} />
            </div>

            <div>
              <InputText name={"colabWatchLp"} label={"L.P."} handleChange={handleChange} value={form.colaborationWatch.colabWatchLp} placeholder={"Ingresar L.P."} />
            </div>
            <div>
              <InputText name={"colabWatchNames"} label={"Nombres"} handleChange={handleChange} value={form.colaborationWatch.colabWatchNames} placeholder={"Ingresar nombres"} />
            </div>
            <div>
              <InputText name={"colabWatchLastNames"} label={"Apellidos"} handleChange={handleChange} value={form.colaborationWatch.colabWatchLastNames} placeholder={"Ingresar apellidos"} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem aria-label="Operador / interventor" title="Direccion / fecha / hora" value={"Direccion / fecha / hora"}>
          {/* GRUPO 3 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <InputText name={"direction"} label={"Direccion"} handleChange={handleChange} value={form.direction} placeholder={"Ingresar direccion"} />
            </div>

            <div>
              <InputDate value={form.eventDate} handleChange={handleDateChange} label={"Fecha del hecho"} />
            </div>

            <div>
              <InputTime name={"callTime"} value={form.callTime} label={"Hora del llamado"} handleChange={handleChange} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem aria-label="Modalidad / comisaria" title="Modalidad / comisaria" value={"Modalidad / comisaria"}>
          {/* GRUPO 4 */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <AutocompleteInput label='Modalidad' data={modalitiesList} name={"modalitie"} setValue={handleAutocompleteChange} value={form.modalitie} />
            </div>

            <div>
              <AutocompleteInput label='Comisaria' data={jurisdictionsList} name={"jurisdiction"} setValue={handleAutocompleteChange} value={form.jurisdiction} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem aria-label="Justicia interventora" title="Justicia interventora" value={"Justicia interventora"}>
          {/* GRUPO 5 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <AutocompleteInput label='Justicia' data={justicesList} name={"justice"} setValue={handleAutocompleteChange} value={form.interveningJustice.justice} />
            </div>

            <div>
              <InputText name={"fiscal"} label={"Fiscal a/c"} handleChange={handleChange} value={form.interveningJustice.fiscal} placeholder={"Ingresar nombre"} />
            </div>

            <div>
              <InputText name={"secretariat"} label={"Secretaria a/c"} handleChange={handleChange} value={form.interveningJustice.secretariat} placeholder={"Ingresar nombre"} />
            </div>
          </section>
        </AccordionItem>
        <AccordionItem aria-label='Reseña' title="Reseña" value="review">
          <div className='p-2'>
            <InputTextArea label={"Reseña"} value={form.review} handleChange={handleChange} name={"review"} />
          </div>
        </AccordionItem>
      </Accordion>


      {/* BOTONES */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <Button color="primary" variant="solid" type='submit' isDisabled={isFormIncomplete || loading}>
          Generar Excel
        </Button>
        <Button color="danger" variant="ghost" onPress={handleClear}>
          Lmpiar campos
        </Button>
      </div>
    </form>


  );
}
