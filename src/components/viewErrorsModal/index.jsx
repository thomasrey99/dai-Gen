'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

/* =========================
   TRADUCCIÓN DE CAMPOS
========================= */

const fieldLabels = {
  area: "Área",
  typeOfIntervention: "Tipo de intervención",
  number: "Número",
  origin: "Origen",

  injuredName: "Nombre del damnificado",
  injuredLastName: "Apellido del damnificado",
  injuredDni: "DNI del damnificado",

  brand: "Marca del vehículo",
  model: "Modelo del vehículo",
  color: "Color del vehículo",
  domain: "Dominio del vehículo",

  colabFirmHierarchy: "Jerarquía firmante",
  colabFirmLp: "LP firmante",
  colabFirmNames: "Nombres firmante",
  colabFirmLastNames: "Apellidos firmante",

  colabWatchHierarchy: "Jerarquía veedor",
  colabWatchLp: "LP veedor",
  colabWatchNames: "Nombres veedor",
  colabWatchLastNames: "Apellidos veedor",

  initTime: "Hora inicio",
  endTime: "Hora finalización",

  cover: "Cobertura",
  summaryNum: "Número de sumario",

  eventDate: "Fecha del hecho",
  callTime: "Hora del llamado",
  direction: "Dirección",
  placeId: "Lugar",

  jurisdiction: "Dependencia",

  justice: "Justicia interviniente",
  fiscal: "Fiscal",
  secretariat: "Secretaría",

  modalitie: "Modalidad delictiva",

  operator: "Visualizador",
  intervener: "Interventor",

  review: "Reseña"
};

const getFieldLabel = (field) => fieldLabels[field] || field;


/* =========================
   APLANAR OBJETO DE ERRORES
========================= */

const flattenErrors = (obj, parent = "") => {
  let result = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = parent ? `${parent}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenErrors(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
};


/* =========================
   COMPONENTE
========================= */

export default function ViewErrorsModal({ errors }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const flatErrors = flattenErrors(errors);

  const errorList = Object.entries(flatErrors).filter(
    ([_, value]) => typeof value === "string" && value.trim() !== ""
  );

  return (
    <>
      <Button
        color="danger"
        onPress={onOpen}
      >
        Ver errores
      </Button>

      <Modal
      scrollBehavior="inside"
        backdrop="opaque"
        classNames={{
          backdrop: "bg-linear-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >

        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-danger">
                Errores del formulario
              </ModalHeader>

              <ModalBody>

                {errorList.length === 0 ? (

                  <p className="text-success font-semibold">
                    No hay errores
                  </p>

                ) : (

                  <ul className="flex flex-col gap-3">

                    {errorList.map(([field, message]) => {

                      const fieldName = field.split(".").pop();

                      return (
                        <li
                          key={field}
                          className="
                            bg-red-500/10
                            border border-red-500/30
                            rounded-lg
                            p-3
                            text-red-300
                          "
                        >
                          <span className="font-semibold text-red-200">
                            {getFieldLabel(fieldName)}
                          </span>
                          {" : "}
                          {message}
                        </li>
                      );

                    })}

                  </ul>

                )}

              </ModalBody>

              <ModalFooter>

                <Button
                  color="danger"
                  onPress={onClose}
                  className="
                    text-white
                    transition-colors duration-300
                    focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50
                  "
                >
                  Cerrar
                </Button>

              </ModalFooter>
            </>
          )}
        </ModalContent>

      </Modal>
    </>
  );
}