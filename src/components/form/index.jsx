'use client';

import temporaryLocationSection from '../Toast';
import { Accordion, AccordionItem, Button, Link, useDisclosure } from "@heroui/react";
import ModalConfirm from '../modal';
import { validations } from '@/utils/validations';
import EventSection from './sections/eventSection';
import OperatorSection from './sections/operatorSection';
import InjuredSection from './sections/injuredSection';
import ColaborationSection from './sections/colaborationSection';
import TemporaryLocationSection from './sections/temporaryLocationSection';
import OperativeContextSection from './sections/operativeContextSection';
import JusticeSection from './sections/justiceSection';
import ReviewSection from './sections/reviewSection';
import Toast from '../Toast';
import { clearForm } from '@/utils/clearForm';
import handleInputChange from '@/utils/handlers/handleInputChange';


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
  
  const handleChange=handleInputChange(form, setForm, setErrors)

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
      temporaryLocationSection('error', 'Error al generar el archivo');
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
          <EventSection
            errors={errors}
            handleChange={handleChange}
            form={form}
          />
        </AccordionItem>
        <AccordionItem
          aria-label="Visualizador / interventor"
          title="Visualizador / interventor"
          key={"Visualizador / interventor"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.operator || errors.intervener) ? "Revisar" : ""}
        >
          {/* GRUPO 2 */}
          <OperatorSection
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        </AccordionItem>

        {/*Grupo damnificado*/}
        <AccordionItem
          aria-label="Datos del damnificado"
          title="Datos del damnificado"
          key={"Datos del damnificado"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.injuredName || errors.injuredLastName || errors.injuredDni) ? "Revisar" : ""}
        >
          <InjuredSection
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        </AccordionItem>
        <AccordionItem
          label="Colaboracion"
          title="Colaboracion"
          isDisabled={form.typeOfIntervention !== "REG LEGALES"} key={"Colaboracion"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.cover || errors.summaryNum || errors.initTime || errors.endTime || errors.colabFirmHierarchy || errors.colabFirmLp || errors.colabFirmNames || errors.colabFirmLastNames || errors.colabWatchHierarchy || errors.colabWatchLp || errors.colabWatchNames || errors.colabWatchLastNames) ? "Revisar" : ""}
        >
          {/*Grupo de colaboracion*/}
          <ColaborationSection
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        </AccordionItem>
        <AccordionItem
          aria-label="Direccion / fecha / hora"
          title="Direccion / fecha / hora"
          key={"Direccion / fecha / hora"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.direction || errors.eventDate || errors.callTime) ? "Revisar" : ""}
        >
          {/* GRUPO 3 */}
          <TemporaryLocationSection
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        </AccordionItem>
        <AccordionItem
          aria-label="Modalidad / Dependencia"
          title="Modalidad / Dependencia"
          key={"Modalidad / Dependencia"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.modalitie || errors.jurisdiction) ? "Revisar" : ""}
        >
          {/* GRUPO 4 */}
          <OperativeContextSection
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        </AccordionItem>
        <AccordionItem
          aria-label="Justicia interventora"
          title="Justicia interventora"
          key={"Justicia interventora"}
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.justice || errors.fiscal || errors.secretariat) ? "Revisar" : ""}
        >
          {/* GRUPO 5 */}
          <JusticeSection
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        </AccordionItem>
        <AccordionItem
          aria-label='Reseña'
          title="Reseña"
          key="review"
          classNames={{ subtitle: "text-danger" }}
          subtitle={(errors.review) ? "Revisar" : ""}
        >
          <ReviewSection
            form={form}
            errors={errors}
            handleChange={handleChange}
          />
        </AccordionItem>
      </Accordion>
      {/* BOTONES */}
      <div
        className="flex flex-col md:flex-row gap-4 mt-6"
      >
        <Button
          color="primary"
          variant="ghost"
          type='submit'
          isDisabled={incomplete || loading}
        >
          Generar Excel
        </Button>
        <Button
          color="success"
          variant="ghost"
          onPress={() => { onOpenChange(true) }}
        >
          Lmpiar campos
        </Button>
      </div>
      <ModalConfirm
        text={"¿Desea limpiar todos los campos del formulario?"}
        title={"Limpiar campos"}
        action={() => clearForm({
          onOpenChange,
          setForm,
          setErrors,
          fileInputRef,
          setPdfURL,
          setFileName,
          setDataObject
        })}
        actionTitle={"Limpiar"}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </form >


  );
}
