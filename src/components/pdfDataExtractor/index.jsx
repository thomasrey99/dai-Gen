'use client';

import { useState } from 'react';
import ModalAlert from '../Toast';
import { jurisdictionsList } from '../../utils/data/jurisdictions';
import { parseDate } from '@internationalized/date';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Input } from '@heroui/input';
import { handleComponentError } from '../../utils/error-handler';

const PdfReader = ({
  setForm,
  setIsLoading,
  fileInputRef,
  pdfURL,
  setPdfURL,
  fileName,
  setFileName,
  setOpenAllSections
}) => {

  const [file, setFile] = useState(null);

  const truncateFileName = (name, maxLength = 25) => {
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength - 3) + '...';
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(truncateFileName(selectedFile.name));

      const fileURL = URL.createObjectURL(selectedFile);
      setPdfURL(fileURL);
    } else {
      ModalAlert('error', 'Por favor, carga un archivo PDF');
      fileInputRef.current && (fileInputRef.current.value = '');
      setPdfURL(null);
      setFile(null);
      setFileName('');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!file) {
        ModalAlert('error', 'No hay archivo seleccionado');
        return;
      }

      setIsLoading(true);

      // Reset form
      setForm({
        area: null,
        typeOfIntervention: null,
        number: null,
        origin: null,
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
        lat: "",
        lng: "",
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

      // 🔥 Enviar archivo al backend
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(process.env.NEXT_PUBLIC_EXTRACT_DATA, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      if (!data?.response) {
        throw new Error('Respuesta vacía o inválida del servidor');
      }

      const parsed = data.response;

      if (parsed?.message) {
        ModalAlert('error', parsed.message);
        fileInputRef.current && (fileInputRef.current.value = '');
        setPdfURL(null);
        setFile(null);
        setFileName('');
        setIsLoading(false);
        return;
      }

      const validJurisdiction =
        jurisdictionsList.find(
          (j) => j.toLowerCase() === (parsed.jurisdiction || '').toLowerCase()
        ) || '';

      const newForm = {
        area: null,
        typeOfIntervention: null,
        number: parsed.number || '',
        origin: null,
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
      setOpenAllSections(true);

    } catch (error) {
      handleComponentError(error, 'Error al procesar el archivo PDF');
      // Reset file state on error
      fileInputRef.current && (fileInputRef.current.value = '');
      setPdfURL(null);
      setFile(null);
      setFileName('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full xl:max-w-2xl p-6 rounded-xl bg-white/5 shadow-lg ring-1 ring-white/10">
      <h2 className="mb-5 text-2xl font-bold text-white tracking-wide text-center sm:text-left">
        Cargar y Extraer Datos del PDF
      </h2>

      <div className="flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-1/3">
          <Input
            type="file"
            accept="application/pdf"
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
            isDisabled={!file}
            className={`flex-1 py-2 rounded-xl font-semibold text-sm shadow transition
              ${!file
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