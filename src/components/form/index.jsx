'use client';

import temporaryLocationSection from '../Toast';
import { Accordion, AccordionItem, Button, Link, useDisclosure } from "@heroui/react";
import ModalConfirm from '../modal';
import EventSection from './sections/eventSection';
import OperatorSection from './sections/operatorSection';
import InjuredSection from './sections/injuredSection';
import ColaborationSection from './sections/colaborationSection';
import TemporaryLocationSection from './sections/temporaryLocationSection';
import OperativeContextSection from './sections/operativeContextSection';
import JusticeSection from './sections/justiceSection';
import ReviewSection from './sections/reviewSection';
import { clearForm } from '@/utils/clearForm';
import handleInputChange from '@/utils/handlers/handleInputChange';
import { useState } from 'react';


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

const PlusIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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

  const [selected, setSelected] = useState("eventSection");

  const handleChange = handleInputChange(form, setForm, setErrors)

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
      onSubmit={onSubmit}
      className="relative overflow-hidden w-full max-w-6xl mx-auto bg-white/5 p-8 xl:p-10 gap-8 flex flex-col rounded-2xl shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition-all duration-300"
    >
      {/* ENCABEZADO */}
      <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-center gap-2">
        <h2 className="text-2xl xl:text-4xl font-bold text-white tracking-tight">
          Formulario de Visualización
        </h2>
        <Link
          className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 underline underline-offset-4 transition"
          isExternal
          showAnchorIcon
          anchorIcon={<AnchorIcon />}
          color="warning"
          href="https://drive.google.com/file/d/1XcEme9ZLJu2l16T_-qrHDhq70zLtrXep/view?usp=sharing"
        >
          Instructivo
        </Link>
      </div>

      {/* ACORDEÓN */}
      <Accordion
        defaultExpandedKeys={['review']}
        showDivider={false}
        className="shadow-none custom-accordion"
        selectionMode="multiple"
      >
        {/* Secciones */}
        <AccordionItem
          indicator={<PlusIcon />}
          title="Área / Tipo / Nº"
          key="Area / Tipo / Nº"
          subtitle={(errors.area || errors.typeOfIntervention || errors.number) ? "Hay errores" : ""}
          classNames={{
            subtitle: "text-danger",
            title: "text-lg",
            content: "pb-6"  // Aquí agregás padding a la sección desplegada
          }}
        >
          <EventSection form={form} errors={errors} handleChange={handleChange} />
        </AccordionItem>


        <AccordionItem
          indicator={<PlusIcon />}
          title="Visualizador / Interventor"
          key="Visualizador / interventor"
          subtitle={(errors.operator || errors.intervener) ? "Hay errores" : ""}
          classNames={{
            subtitle: "text-danger",
            title: "text-lg",
            content: "pb-6"  // Aquí agregás padding a la sección desplegada
          }}
        >
          <OperatorSection form={form} errors={errors} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem
          indicator={<PlusIcon />}
          title="Datos del Damnificado"
          key="Datos del damnificado"
          subtitle={(errors.injuredName || errors.injuredLastName || errors.injuredDni) ? "Hay errores" : ""}
          classNames={{
            subtitle: "text-danger",
            title: "text-lg",
            content: "pb-6"  // Aquí agregás padding a la sección desplegada
          }}
        >
          <InjuredSection form={form} errors={errors} handleChange={handleChange} />
        </AccordionItem>

        {form.typeOfIntervention === "REG LEGALES" && (
          <AccordionItem
            indicator={<PlusIcon />}
            title="Colaboración"
            key="Colaboracion"
            subtitle={(errors.cover || errors.summaryNum || errors.initTime || errors.endTime || errors.colabFirmHierarchy || errors.colabFirmLp || errors.colabFirmNames || errors.colabFirmLastNames || errors.colabWatchHierarchy || errors.colabWatchLp || errors.colabWatchNames || errors.colabWatchLastNames) ? "Hay errores" : ""}
            classNames={{
              subtitle: "text-danger",
              title: "text-lg",
              content: "pb-6"  // Aquí agregás padding a la sección desplegada
            }}
          >
            <ColaborationSection form={form} errors={errors} handleChange={handleChange} />
          </AccordionItem>
        )}

        <AccordionItem
          indicator={<PlusIcon />}
          title="Dirección / Fecha / Hora"
          key="Direccion / fecha / hora"
          subtitle={(errors.direction || errors.eventDate || errors.callTime) ? "Hay errores" : ""}
          classNames={{
            subtitle: "text-danger",
            title: "text-lg",
            content: "pb-6"  // Aquí agregás padding a la sección desplegada
          }}
        >
          <TemporaryLocationSection form={form} errors={errors} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem
          indicator={<PlusIcon />}
          title="Modalidad / Dependencia"
          key="Modalidad / Dependencia"
          subtitle={(errors.modalitie || errors.jurisdiction) ? "Hay errores" : ""}
          classNames={{
            subtitle: "text-danger",
            title: "text-lg",
            content: "pb-6"  // Aquí agregás padding a la sección desplegada
          }}
        >
          <OperativeContextSection form={form} errors={errors} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem
          indicator={<PlusIcon />}
          title="Justicia Interventora"
          key="Justicia interventora"
          subtitle={(errors.justice || errors.fiscal || errors.secretariat) ? "Hay errores" : ""}
          classNames={{
            subtitle: "text-danger",
            title: "text-lg",
            content: "pb-6"  // Aquí agregás padding a la sección desplegada
          }}
        >
          <JusticeSection form={form} errors={errors} handleChange={handleChange} />
        </AccordionItem>

        <AccordionItem
          indicator={<PlusIcon />}
          title="Reseña"
          key="review"
          subtitle={errors.review ? "Hay errores" : ""}
          classNames={{
            subtitle: "text-danger",
            title: "text-lg",
            content: "py-6"  // Aquí agregás padding a la sección desplegada
          }}
        >
          <ReviewSection form={form} errors={errors} handleChange={handleChange} />
        </AccordionItem>
      </Accordion>

      {/* BOTONES */}
      <div className="flex flex-col md:flex-row gap-4 mt-8">
        <Button
          color="primary"
          variant="ghost"
          type="submit"
          isDisabled={incomplete || loading}
          className={`
            w-full md:w-auto
            px-6 py-3 rounded-xl font-semibold text-lg
            transition-colors duration-300
            ${incomplete || loading
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-sky-600 hover:bg-sky-700 text-white shadow-lg"
            }
            focus:outline-none focus:ring-4 focus:ring-sky-400 focus:ring-opacity-50
          `}
        >
          Generar Excel
        </Button>

        <Button
          color="success"
          variant="ghost"
          onPress={() => onOpenChange(true)}
          className="
            w-full md:w-auto
            px-6 py-3 rounded-xl font-semibold text-lg
            bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg
            transition-colors duration-300
            focus:outline-none focus:ring-4 focus:ring-emerald-400 focus:ring-opacity-50
          "
        >
          Limpiar Campos
        </Button>
      </div>


      <ModalConfirm
        text="¿Desea limpiar todos los campos del formulario?"
        title="Limpiar campos"
        action={() => clearForm({
          onOpenChange,
          setForm,
          setErrors,
          fileInputRef,
          setPdfURL,
          setFileName,
          setDataObject
        })}
        actionTitle="Limpiar"
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </form>
  );
}
