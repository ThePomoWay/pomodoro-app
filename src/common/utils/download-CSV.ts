export function getCSVDownloadLink(fileName, headerRow, contentRows) {
  let csvContent =
    "data:text/csv;charset=utf-8," +
    headerRow.join(",") +
    "\n" +
    contentRows.map((e) => e.join(",")).join("\n");

  return encodeURI(csvContent);
}
