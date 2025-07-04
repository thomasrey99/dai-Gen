'use client';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import ModalAlert from '../Toast';
import { jurisdictionsList } from '../../utils/data/jurisdictions';
import { parseDate } from '@internationalized/date';
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

      // Limpio el form actual
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

      // Llamada a la API para extraer datos del PDF
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

      const newForm = {
        area: null,
        typeOfIntervention: null,
        number: parsed.number || '',
        injured: {
          injuredName: parsed.injuredName || '',
          injuredLastName: parsed.injuredLastName || '',
          injuredDni: parsed.injuredDni || '',
          vehicle: {
            brand: parsed.injuredVehicleBrand || '',
            model: parsed.injuredVehicleModel || '',
            color: parsed.injuredVehicleColor || '',
            domain: parsed.injuredVehicleDomain || ''
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
        eventDate: parsed.eventDate ? parseDate(parsed.eventDate) : null,
        callTime: parsed.callTime || '',
        direction: parsed.direction || '',
        placeId: "",
        jurisdiction: validJurisdiction,
        interveningJustice: {
          justice: parsed.justice || '',
          fiscal: parsed.fiscal || '',
          secretariat: parsed.secretariat || ''
        },
        modalitie: parsed.modalitie || '',
        operator: '',
        intervener: '',
        review: parsed.review || '',
      };

      setForm(newForm);

      ModalAlert('success', 'Datos cargados con éxito, verifica que sean correctos');

    } catch (error) {
      console.error('Error al extraer datos:', error);
      ModalAlert('error', 'Error inesperado al procesar el archivo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full xl:max-w-2xl p-6 rounded-xl bg-white/5 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
      <h2 className="mb-5 text-2xl font-bold text-white tracking-wide text-center sm:text-left">
        Cargar y Extraer Datos del PDF
      </h2>

      <div className="flex flex-col xl:flex-row gap-4">
        {/* Input archivo */}
        <div className="w-full xl:w-1/3">
          <Input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="text-white placeholder:text-gray-400"
          />
        </div>

        {/* Nombre archivo */}
        <div className="w-full xl:w-1/3">
          <Input
            type="text"
            readOnly
            value={fileName}
            placeholder="No hay archivo seleccionado"
            title={fileName}
            className="text-white placeholder:text-gray-400 "
          />
        </div>

        {/* Botones */}
        <div className="w-full xl:w-1/3 flex flex-col xl:flex-row gap-2">
          <Button
            onPress={handleSubmit}
            isDisabled={!dataObject}
            className={`flex-1 py-2 rounded-xl font-semibold text-sm shadow transition
          ${!dataObject
                ? 'bg-gray-500 cursor-not-allowed opacity-50 text-white'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
              }`}
          >
            Extraer
          </Button>

          {pdfURL && (
            <Link
              href={pdfURL}
              isExternal
              className="flex-1 py-2 px-4 text-white text-sm font-semibold rounded-xl shadow bg-cyan-600 hover:bg-cyan-700 transition flex items-center justify-center"
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
