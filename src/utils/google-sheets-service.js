export default class GoogleSheetsService {
  async getSheet(sheetId, query) {
    try {
      const sheetUrl = "https://docs.google.com/spreadsheets/d";
      query = encodeURI(query);
      let fileURL = `${sheetUrl}/${sheetId}/gviz/tq?tq=${query}`;
      const response = await fetch(fileURL);
      const txt = await response.text();
      const jsonStart = txt.indexOf("({") + 1;
      const text = txt.slice(jsonStart, -2);
      const json = JSON.parse(text);
      return new Promise((resolve) => {
        resolve(this.convertJson(json));
      });
    } catch (error) {
      return new Promise((_, reject) => {
        reject(error);
      });
    }
  }

  convertJson(json) {
    const rows = json.table.rows;
    return rows.map(row => {
      if (row && 'c' in row) {
        return row.c.map(item => {
          if (item && 'f' in item) {
            return item.f;
          } else if (item && 'v' in item) {
            return item.v;
          }
          return null;
        });
      }
      return row;
    });
  }
}
