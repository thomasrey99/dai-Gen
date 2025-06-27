'use client';

import { useState, useRef, useEffect } from 'react';
import ExcelForm from '@/components/form';
import PdfReader from '@/components/pdfDataExtractor';
import Image from 'next/image';
import Loading from '@/components/loading';
import { validations } from '@/utils/validations';

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
    review: '',
  });

  const [errors, setErrors] = useState({});

  // Función para validar todo el form (recursiva para anidados)
  const validateForm = (obj, path = '') => {
    let newErrors = {};
    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Validar recursivamente objetos anidados
        const nestedErrors = validateForm(value, currentPath);
        newErrors = { ...newErrors, ...nestedErrors };
      } else {
        const fieldName = key;
        const fieldErrors = validations(fieldName, value, form);
        if (fieldErrors && fieldErrors[fieldName]) {
          newErrors[fieldName] = fieldErrors[fieldName];
        } else {
          if (errors[fieldName]) {
            newErrors[fieldName] = '';
          }
        }
      }
    }
    return newErrors;
  };

  useEffect(() => {
    const rawErrors = validateForm(form);
    const filteredErrors = Object.fromEntries(
      Object.entries(rawErrors).filter(([_, v]) => v && v.trim() !== '')
    );
    setErrors(filteredErrors);
  }, [form]);

  useEffect(() => {
    if (form.typeOfIntervention === "REG LEGALES") return;

    const firmFields = Object.values(form.colaboration.colaborationFirm);
    const watchFields = Object.values(form.colaboration.colaborationWatch);
    const rangeTimeFields = Object.values(form.colaboration.rangeTime);
    const otherFields = [form.colaboration.cover, form.colaboration.summaryNum];
    const hasAnyColabData = [...firmFields, ...watchFields, ...rangeTimeFields, ...otherFields].some(value => value);

    if (hasAnyColabData) {
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
          rangeTime: {
            initTime: "",
            endTime: ""
          },
          cover: "",
          summaryNum: "",
        },
        callTime: ""
      }));
    }
  }, [form.typeOfIntervention]);

  return (
    <div
      className="
        relative flex flex-col min-h-screen w-full text-white font-sans bg-black
        after:content-[''] after:absolute after:inset-0 after:bg-noise-pattern after:opacity-5 after:pointer-events-none after:z-0
      "
    >
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <header className="w-full px-6 py-8 flex flex-col xl:flex-row gap-4 items-center justify-between xl:max-w-7xl mx-auto">
          <div className="flex sm:mb-6 xl:mb-0 flex-col xl:flex-row gap-4 items-center justify-start">
            <Image src="/logo.png" alt="deai logo" width={150} height={150} />
            <h1 className="text-5xl font-extrabold tracking-wide bg-gradient-to-r from-sky-400 via-sky-200 to-sky-600 bg-[length:300%_300%] bg-clip-text text-transparent animate-glow">
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
    </div>
  );
};

export default ExcelModifier;
