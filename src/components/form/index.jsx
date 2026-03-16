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
import ViewErrorsModal from '../viewErrorsModal';


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

  const handleChange = handleInputChange(form, setForm, setErrors)


  /* ------------------------------
  DETECTAR VALORES VACIOS
  ------------------------------ */

  const isEmptyValue = (value) => {

    if (value === null || value === undefined) return true;

    if (typeof value === "string" && value.trim() === "") return true;

    if (typeof value === "object") {
      return Object.values(value).every(v => !v);
    }

    return false;

  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };


  /* ------------------------------
  CONTAR ERRORES
  ------------------------------ */

  const countErrors = (fields) => {

    return fields.filter(field => {

      const error = getNestedValue(errors, field);

      return typeof error === "string" && error.trim() !== "";

    }).length;
  };


  /* ------------------------------
  CONTAR INCOMPLETOS
  ------------------------------ */

  const countIncomplete = (fields) => {

    return fields.filter(field => {

      const error = getNestedValue(errors, field);

      if (error) return false;

      const value = getNestedValue(form, field);

      return isEmptyValue(value);

    }).length;

  };


  /* ------------------------------
  ESTADO DE SECCION
  ------------------------------ */

  const getSectionStatus = (fields) => {

    const errorCount = countErrors(fields);

    const incompleteCount = countIncomplete(fields);

    return {
      errors: errorCount,
      incomplete: incompleteCount
    };

  };


  /* ------------------------------
  SUBTITLE
  ------------------------------ */

  const getSubtitle = ({ errors, incomplete }) => {

    if (errors > 0) {

      return errors === 1 ? "1 error" : `${errors} errores`;

    }

    if (incomplete > 0) {

      return incomplete === 1
        ? "1 incompleto"
        : `${incomplete} incompletos`;

    }

    return "Completo";

  };


  /* ------------------------------
  TITULO CON COLOR
  ------------------------------ */

  const getTitle = (text, status) => {

    if (status.errors > 0) {

      return (
        <span className="flex items-center gap-2 text-danger">
          {text}
        </span>
      );

    }

    if (status.incomplete > 0) {

      return (
        <span className="flex items-center gap-2 text-warning">
          {text}
        </span>
      );

    }

    return (
      <span className="flex items-center gap-2 text-success">
        {text}
        <span className="text-emerald-400 font-bold">✔</span>
      </span>
    );

  };


  /* ------------------------------
  ESTADOS DE SECCIONES
  ------------------------------ */

  const eventStatus = getSectionStatus([
    "area",
    "typeOfIntervention",
    "number",
    "origin"
  ]);


  const operatorStatus = getSectionStatus([
    "operator",
    "intervener"
  ]);


  const injuredStatus = getSectionStatus([
  "injured.injuredName",
  "injured.injuredLastName",
  "injured.injuredDni"
  ]);


  const colaborationStatus = getSectionStatus([
    "cover",
    "summaryNum",
    "initTime",
    "endTime",
    "colabFirmHierarchy",
    "colabFirmLp",
    "colabFirmNames",
    "colabFirmLastNames",
    "colabWatchHierarchy",
    "colabWatchLp",
    "colabWatchNames",
    "colabWatchLastNames"
  ]);


  const locationStatus = getSectionStatus([
    "direction",
    "eventDate",
    "callTime"
  ]);


  const operativeStatus = getSectionStatus([
    "modalitie",
    "jurisdiction"
  ]);


  const justiceStatus = getSectionStatus([
  "interveningJustice.justice",
  "interveningJustice.fiscal",
  "interveningJustice.secretariat"
]);


  const reviewStatus = getSectionStatus([
    "review"
  ]);


  /* ------------------------------
  SUBMIT
  ------------------------------ */

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


  /* ------------------------------
  VALIDAR FORM
  ------------------------------ */

  const hasFormErrors = (errors) => {

    return Object.values(errors).some(
      error => typeof error === 'string' && error.trim() !== ''
    );

  };

  const incomplete = hasFormErrors(errors);


  /* ------------------------------
  UI
  ------------------------------ */

  return (

    <form
      onSubmit={onSubmit}
      className="relative overflow-hidden w-full max-w-6xl mx-auto bg-white/5 p-8 xl:p-10 gap-8 flex flex-col rounded-2xl shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition-all duration-300"
    >

      <div className="flex justify-between items-center">

        <h2 className="text-3xl font-bold text-white">
          Formulario de Visualización
        </h2>

        <Link
          isExternal
          color="warning"
          href="https://drive.google.com/file/d/1XcEme9ZLJu2l16T_-qrHDhq70zLtrXep/view"
        >
          Instructivo
        </Link>

      </div>


      <Accordion
        defaultExpandedKeys={['review']}
        selectionMode="multiple"
        showDivider={false}
      >

        <AccordionItem
          title={getTitle("Área / Tipo / Nº", eventStatus)}
          subtitle={getSubtitle(eventStatus)}
        >
          <EventSection form={form} errors={errors} handleChange={handleChange}/>
        </AccordionItem>


        <AccordionItem
          title={getTitle("Visualizador / Interventor", operatorStatus)}
          subtitle={getSubtitle(operatorStatus)}
        >
          <OperatorSection form={form} errors={errors} handleChange={handleChange}/>
        </AccordionItem>


        <AccordionItem
          title={getTitle("Datos del Damnificado", injuredStatus)}
          subtitle={getSubtitle(injuredStatus)}
        >
          <InjuredSection form={form} errors={errors} handleChange={handleChange}/>
        </AccordionItem>


        {form.typeOfIntervention === "REG LEGALES" && (

          <AccordionItem
            title={getTitle("Colaboración", colaborationStatus)}
            subtitle={getSubtitle(colaborationStatus)}
          >
            <ColaborationSection form={form} errors={errors} handleChange={handleChange}/>
          </AccordionItem>

        )}


        <AccordionItem
          title={getTitle("Dirección / Fecha / Hora", locationStatus)}
          subtitle={getSubtitle(locationStatus)}
        >
          <TemporaryLocationSection form={form} errors={errors} handleChange={handleChange}/>
        </AccordionItem>


        <AccordionItem
          title={getTitle("Modalidad / Dependencia", operativeStatus)}
          subtitle={getSubtitle(operativeStatus)}
        >
          <OperativeContextSection form={form} errors={errors} handleChange={handleChange}/>
        </AccordionItem>


        <AccordionItem
          title={getTitle("Justicia Interventora", justiceStatus)}
          subtitle={getSubtitle(justiceStatus)}
        >
          <JusticeSection form={form} errors={errors} handleChange={handleChange}/>
        </AccordionItem>


        <AccordionItem
          key="review"
          title={getTitle("Reseña", reviewStatus)}
          subtitle={getSubtitle(reviewStatus)}
        >
          <ReviewSection form={form} errors={errors} handleChange={handleChange}/>
        </AccordionItem>

      </Accordion>


      <div className="flex gap-4 mt-6">

        <Button
          color="primary"
          type="submit"
          isDisabled={incomplete || loading}
        >
          Generar Excel
        </Button>

        <Button
          color="warning"
          onPress={() => onOpenChange(true)}
        >
          Limpiar Campos
        </Button>

        {incomplete && (
          <ViewErrorsModal errors={errors}/>
        )}

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