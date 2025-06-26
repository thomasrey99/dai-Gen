'use client';

import { useState, useRef, useEffect, use } from 'react';
import ExcelForm from '@/components/form';
import PdfReader from '@/components/pdfDataExtractor';
import Image from 'next/image';
import Loading from '@/components/loading';

const ExcelModifier = () => {
  const fileInputRef = useRef(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [dataObject, setDataObject] = useState(null);
  const [form, setForm] = useState({
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
  const [errors, setErrors] = useState(
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

  useEffect(() => {
    if (form.typeOfIntervention !== "REG LEGALES" && (form.colaboration.colaborationFirm.colabFirmHierarchy || form.colaboration.colaborationFirm.colabFirmLastNames || form.colaboration.colaborationFirm.colabFirmNames || form.colaboration.colaborationFirm.colabFirmLp || form.colaboration.colaborationWatch.colabWatchHierarchy || form.colaboration.colaborationWatch.colabWatchLp || form.colaboration.colaborationWatch.colabWatchNames || form.colaboration.colaborationWatch.colabWatchLastNames || form.colaboration.cover || form.colaboration.summaryNum)) {
      setForm(prev => ({
        ...prev,
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
          cover: "",
          summaryNum: ""
        }
      }))
    }
  }, [form.typeOfIntervention]);

  useEffect(()=>{ 
    console.log("errores:", errors)
    console.log(form)
  },[form])

  return (
    <div
      className="relative bg-black flex flex-col min-h-screen w-full text-white font-sans"

    >
      <header className="w-full px-6 py-8 flex flex-col xl:flex-row gap-4 items-center justify-between xl:max-w-7xl mx-auto">
        <div className="flex sm:mb-6 xl:mb-0 flex-col xl:flex-row gap-4 items-center justify-start">
          <Image src="/dai.png" alt="deai logo" width={150} height={150} />
          <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600 text-transparent bg-clip-text animate-pulse">
            DAI GEN
          </h1>
        </div>

        <PdfReader
          form={form}
          setForm={setForm}
          setErrors={setErrors}
          setIsLoading={setIsLoading}
          fileInputRef={fileInputRef}
          pdfURL={pdfURL}
          setPdfURL={setPdfURL}
          setFileName={setFileName}
          fileName={fileName}
          dataObject={dataObject}
          setDataObject={setDataObject}
        />
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pb-10">
        <div className="bg-white/5 backdrop-blur-xs p-6 rounded-xl shadow-xl ring-1 ring-white/10">
          <ExcelForm
            form={form}
            setForm={setForm}
            errors={errors}
            setErrors={setErrors}
            loading={loading}
            fileInputRef={fileInputRef}
            setPdfURL={setPdfURL}
            setDataObject={setDataObject}
            setIsLoading={setIsLoading}
            setFileName={setFileName}
          />
        </div>
      </main>

      {loading && <Loading />}
    </div>
  );
};

export default ExcelModifier;
