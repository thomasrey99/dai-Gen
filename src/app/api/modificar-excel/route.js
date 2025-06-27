import XlsxPopulate from 'xlsx-populate';
import path from 'path';

export async function POST(req) {
  try {
    const data = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'planilla visualizador.xlsx');

    const workbook = await XlsxPopulate.fromFileAsync(filePath);
    const sheet = workbook.sheet('DETALLE');

    const formatTime = (time) => {
      if (typeof time === "string" && time.trim() !== "") {
        return time.slice(0, 5);
      }
      return "00:00";
    };

    // Establecer valores según intervención
    let horario = data?.callTime || "";
    if (data.typeOfIntervention === "REG LEGALES") {
      const init = formatTime(data?.colaboration?.rangeTime?.initTime);
      const end = formatTime(data?.colaboration?.rangeTime?.endTime);
      horario = `${init} hs A ${end} hs`;
      sheet.cell('D6').value(horario).style({ fontFamily: 'Calibri', bold: true, border: true });
    }

    // Datos básicos
    sheet.cell('A2').value(data?.typeOfIntervention).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B2').value(data?.number).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B3').value(data?.area).style({ fontFamily: 'Calibri', bold: true, border: true });

    // Visualizador e interventor
    sheet.cell('B14').value(data?.operator || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B15').value(data?.intervener || '').style({ fontFamily: 'Calibri', bold: true, border: true });

    // Colaboración
    sheet.cell('B12').value(data?.colaboration?.colaborationFirm?.colabFirmHierarchy || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('C12').value(data?.colaboration?.colaborationFirm?.colabFirmLp || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D12').value(data?.colaboration?.colaborationFirm?.colabFirmNames || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('E12').value(data?.colaboration?.colaborationFirm?.colabFirmLastNames || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B13').value(data?.colaboration?.colaborationWatch?.colabWatchHierarchy || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('C13').value(data?.colaboration?.colaborationWatch?.colabWatchLp || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D13').value(data?.colaboration?.colaborationWatch?.colabWatchNames || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('E13').value(data?.colaboration?.colaborationWatch?.colabWatchLastNames || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B10').value(data?.colaboration?.cover || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D10').value(data?.colaboration?.summaryNum || '').style({ fontFamily: 'Calibri', bold: true, border: true });

    // Ubicación temporal
    sheet.cell('B5').value(data?.eventDate).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B6').value(data?.direction).style({ fontFamily: 'Calibri', bold: true, border: true });
    if(data?.typeOfIntervention!=="REG LEGALES"){
      sheet.cell('D5').value(data?.callTime).style({ fontFamily: 'Calibri', bold: true, border: true });
    }
    // Contexto operativo
    sheet.cell('B7').value(data?.modalitie).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B9').value(data?.jurisdiction || '').style({ fontFamily: 'Calibri', bold: true, border: true });

    // Justicia interventora
    sheet.cell('B8').value(data?.interveningJustice?.justice || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('C8').value(data?.interveningJustice?.fiscal || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D8').value(data?.interveningJustice?.secretariat || '').style({ fontFamily: 'Calibri', bold: true, border: true });

    // Reseña
    sheet.cell('B28').value(data?.review || '');

    // Fórmulas auxiliares
    sheet.cell('C9').formula('IF(ISNUMBER(FIND("COMISARIA VECINAL", B9)), SUBSTITUTE(MID(B9, FIND("VECINAL", B9) + 8, 10), " ANEXO", ""), "")');
    sheet.cell('D9').formula('IF(C9<>"", MID(C9, 1, LEN(C9)-1), "")');

    // Datos del damnificado
    const brand = data?.injured?.vehicle?.brand?.trim() || "xxxxxx";
    const model = data?.injured?.vehicle?.model?.trim() || "xxxxxx";
    const color = data?.injured?.vehicle?.color?.trim() || "xxxxxx";
    const domain = data?.injured?.vehicle?.domain?.trim() || "xxxxxx";
    const dni = data?.injured?.injuredDni?.trim() || "";
    const fullName = `${data?.injured?.injuredName?.trim() || ""} ${data?.injured?.injuredLastName?.trim() || ""}`.trim();

    const descripcion =
      `Fuente: ${data?.typeOfIntervention || ''} ${data?.number || ''}\n` +
      `Hecho: ${data?.modalitie || ''}\n` +
      `Magistrado: ${data?.interveningJustice?.justice || ''}\n` +
      `Dependencia: ${data?.jurisdiction || ''}\n` +
      `Fecha del hecho: ${data?.eventDate || ''}            Horario: ${horario}\n` +
      `Dirección: ${data?.direction || ''}\n` +
      `Vehiculo Damnificado:  Marca: ${brand} Modelo: ${model} Color: ${color} Chapa Patente: ${domain}.-\n` +
      `DNI Damnificado(sin puntos): ${dni}\n` +
      `Nombre y Apellido Damnificado/s: ${fullName}`;

    sheet.cell('B27').value(descripcion).style({ wrapText: true });

    const buffer = await workbook.outputAsync();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=PLANILLA_DE_VISUALIZACION.xlsx',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('❌ Error al generar Excel:', error);
    return new Response(JSON.stringify({ error: 'Error al generar Excel' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
