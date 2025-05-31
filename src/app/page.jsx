'use client';

import { useState, useRef, useEffect } from 'react';
import ExcelForm from '@/components/form';
import PdfReader from '@/components/inputPdf';
import Image from 'next/image';
import Loading from '@/components/loading';
import { useDisclosure } from '@heroui/react';
import ModalConfirm from '@/components/modal';

const ExcelModifier = () => {
  const fileInputRef = useRef(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [dataObject, setDataObject] = useState(null);
  const [form, setForm] = useState({
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

  useEffect(() => {
    if (form.typeOfIntervention !== "REG LEGALES" && (form.colaborationFirm.colabFirmHierarchy || form.colaborationFirm.colabFirmLastNames || form.colaborationFirm.colabFirmNames || form.colaborationFirm.colabFirmLp || form.colaborationWatch.colabWatchHierarchy || form.colaborationWatch.colabWatchLp || form.colaborationWatch.colabWatchNames || form.colaborationWatch.colabWatchLastNames || form.cover || form.summaryNum)) {
      setForm(prev => ({
        ...prev,
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
      }))
    }
  }, [form.typeOfIntervention]);

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
