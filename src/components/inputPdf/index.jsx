'use client';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import ModalAlert from '../modalAlert';
import { jurisdictionsList } from '../../../public/data/jurisdictions';
import { parseDate, getLocalTimeZone, CalendarDate } from '@internationalized/date';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Input } from '@heroui/input';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfReader = ({
  form,
  setForm,
  setIsLoading,
  fileInputRef,
  pdfURL,
  setPdfURL,
  dataObject,
  setDataObject,
  fileName,
  setFileName
}) => {

  const truncateFileName = (name, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength - 3) + '...';
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFileName(truncateFileName(file.name));
      try {
        const fileURL = URL.createObjectURL(file);
        setPdfURL(fileURL);

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const typedArray = new Uint8Array(e.target.result);
            const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              const lines = {};
              content.items.forEach((item) => {
                const y = Math.floor(item.transform[5]);
                if (!lines[y]) lines[y] = [];
                lines[y].push(item.str);
              });
              const sorted = Object.keys(lines).sort((a, b) => b - a);
              fullText += sorted.map((y) => lines[y].join(' ')).join('\n') + '\n';
            }

            setDataObject(fullText);
          } catch {
            ModalAlert('error', 'Error al procesar el PDF');
            fileInputRef.current && (fileInputRef.current.value = '');
            setPdfURL(null);
            setDataObject(null);
            setFileName('');
          }
        };

        reader.readAsArrayBuffer(file);
      } catch {
        ModalAlert('error', 'Error al procesar el archivo');
        fileInputRef.current && (fileInputRef.current.value = '');
        setPdfURL(null);
        setDataObject(null);
        setFileName('');
      }
    } else {
      ModalAlert('error', 'Por favor, carga un archivo PDF');
      fileInputRef.current && (fileInputRef.current.value = '');
      setPdfURL(null);
      setDataObject(null);
      setFileName('');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
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

      const res = await fetch(process.env.NEXT_PUBLIC_EXTRACT_DATA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: dataObject }),
      });

      const data = await res.json();
      if (!data?.response) throw new Error('Respuesta vacía del servidor');
      const parsed =
        typeof data.response === 'string'
          ? JSON.parse(data.response)
          : data.response;
      if (parsed?.message) {
        ModalAlert('error', parsed.message);
        fileInputRef.current && (fileInputRef.current.value = '');
        setPdfURL(null);
        setDataObject(null);
        setFileName('');
        setIsLoading(false);
        return false;
      }

      const validJurisdiction =
        jurisdictionsList.find(
          (j) => j.toLowerCase() === (parsed.jurisdiction || '').toLowerCase()
        ) || '';

      setForm({
        ...form,
        number: parsed.number || '',
        eventDate: parseDate(parsed?.eventDate) || '',
        callTime: parsed.callTime || '',
        direction: parsed.direction || '',
        jurisdiction: validJurisdiction,
        modalitie: parsed.modalitie || '',
        interveningJustice: {
          justice: parsed.justice || '',
          fiscal: parsed.fiscal || '',
          secretariat: parsed.secretariat || ''
        },
        review: parsed.review || '',
      });

      ModalAlert('success', 'Datos cargados con éxito, verifica que sean correctos');
    } catch (error) {
      console.error('Error al extraer datos:', error);
      ModalAlert('error', 'Error inesperado al procesar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full xl:max-w-2xl p-4 sm:p-6 rounded-lg bg-white/5 shadow ring-1 ring-white/10 backdrop-blur-md">

      <h2 className="mb-3 text-base sm:text-lg font-semibold text-white tracking-wide text-center sm:text-left">
        Cargar y Extraer Datos del PDF
      </h2>

      <div className="w-full flex flex-col xl:flex-row gap-3 sm:gap-2">
        <div className="w-full xl:w-1/3">
          <Input
            type='file'
            accept='application/pdf'
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>


        <div className="w-full xl:w-1/3">
          <Input
            type="text"
            readOnly
            value={fileName}
            placeholder="No hay archivo seleccionado"
            title={fileName}
          />
        </div>

        <div className="w-full xl:w-1/3 flex flex-col xl:flex-row gap-2">
          <Button
            onPress={handleSubmit}
            isDisabled={!dataObject}
            className={`flex-1 py-2 rounded-md shadow transition font-semibold text-sm
              ${!dataObject
                ? 'bg-gray-500 cursor-not-allowed opacity-50 text-white'
                : 'bg-sky-700 hover:bg-sky-800 text-white'
              }`}
          >
            Extraer
          </Button>

          {pdfURL && (
            <Link
              href={pdfURL}
              isExternal
              className="flex-1 py-2 text-white bg-cyan-600 hover:bg-cyan-700 rounded-md shadow transition font-semibold text-sm flex items-center justify-center"

            >
              Ver PDF
            </Link>
          )}
        </div>


      </div>
    </section>

  );
};

export default PdfReader;
