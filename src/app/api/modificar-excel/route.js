import ExcelJS from 'exceljs';
import path from 'path';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req) {
  try {
    const data = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'planilla visualizador.xlsx');

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('DETALLE');

    // Celdas con valor, fuente Calibri bold y borde
    const cellsToFormat = [
      ['A2', data.typeOfIntervention],
      ['B2', data.number],
      ['B3', data.area],
      ['B5', data.eventDate],
      ['D5', data.callTime],
      ['B6', data.direction],
      ['B7', data.modalitie],
      ['B8', data.interveningJustice?.justice || ''],
      ['C8', data.interveningJustice?.fiscal || ''],
      ['D8', data.interveningJustice?.secretariat || ''],
      ['B9', data.jurisdiction || ''],
      ['B14', data.operator || ''],
      ['B15', data.intervener || ''],
      ['B12', data.colaborationFirm?.colabFirmHierarchy || ''],
      ['C12', data.colaborationFirm?.colabFirmLp || ''],
      ['D12', data.colaborationFirm?.colabFirmNames || ''],
      ['E12', data.colaborationFirm?.colabFirmLastNames || ''],
      ['B13', data.colaborationWatch?.colabWatchHierarchy || ''],
      ['C13', data.colaborationWatch?.colabWatchLp || ''],
      ['D13', data.colaborationWatch?.colabWatchNames || ''],
      ['E13', data.colaborationWatch?.colabWatchLastNames || ''],
      ['B10', data.cover || ''],
      ['D10', data.summaryNum || '']
    ];

    cellsToFormat.forEach(([cellRef, value]) => {
      const cell = worksheet.getCell(cellRef);
      cell.value = value;
      cell.font = { name: 'Calibri', bold: true };
      cell.border = {
        top: { style: 'medium', color: { argb: '000000' } },
        left: { style: 'medium', color: { argb: '000000' } },
        bottom: { style: 'medium', color: { argb: '000000' } },
        right: { style: 'medium', color: { argb: '000000' } },
      };
    });

    // Restaurar fórmula en C9 y D9
    worksheet.getCell('C9').value = {
      formula: 'IF(ISNUMBER(FIND("COMISARIA VECINAL", B9)), SUBSTITUTE(MID(B9, FIND("VECINAL", B9) + 8, 10), " ANEXO", ""), "")',
    };

    worksheet.getCell('D9').value = {
      formula: 'IF(C9<>"", MID(C9, 1, LEN(C9)-1), "")',
    };

    // Reseña sin estilos extra
    worksheet.getCell('B28').value = data.review || '';

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=PLANILLA_DE_VISUALIZACION.xlsx', // ✅ sin tilde
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
