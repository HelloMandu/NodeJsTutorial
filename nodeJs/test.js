const fs = require('fs')
const XLSX = require('xlsx')

const buf = fs.readFileSync('./fire.xls');
const wb = XLSX.read(buf, { type: 'buffer' });

wb.SheetNames.forEach((sheetName) => {
  console.log('sheetName: ' + sheetName)

  let rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
  console.log(rows)
})
