conv.close(
  new List({
    title: `${today}'s schedule`,
    items: {
      [entries[0][1].name]: {
        synonyms: [`${entries[0][1].name}`],
        title: `${entries[0][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[0][0].substring(1))
        )} by ${entries[i][1].name} by ${entries[i][1].Professor} `
      },
      [entries[1][1].name]: {
        synonyms: [`${entries[1][1].name}`],
        title: `${entries[1][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[1][0].substring(1))
        )} by ${entries[1][1].name} by ${entries[1][1].Professor} `
      },
      [entries[2][1].name]: {
        synonyms: [`${entries[2][1].name}`],
        title: `${entries[2][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[2][0].substring(1))
        )} by ${entries[2][1].name} by ${entries[2][1].Professor} `
      },
      [entries[3][1].name]: {
        synonyms: [`${entries[3][1].name}`],
        title: `${entries[3][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[3][0].substring(1))
        )} by ${entries[3][1].name} by ${entries[3][1].Professor} `
      },
      [entries[4][1].name]: {
        synonyms: [`${entries[4][1].name}`],
        title: `${entries[4][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[4][0].substring(1))
        )} by ${entries[4][1].name} by ${entries[4][1].Professor} `
      },
      [entries[5][1].name]: {
        synonyms: [`${entries[5][1].name}`],
        title: `${entries[5][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[5][0].substring(1))
        )} by ${entries[5][1].name} by ${entries[5][1].Professor} `
      },
      [entries[6][1].name]: {
        synonyms: [`${entries[6][1].name}`],
        title: `${entries[6][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[6][0].substring(1))
        )} by ${entries[6][1].name} by ${entries[6][1].Professor} `
      },
      [entries[7][1].name]: {
        synonyms: [`${entries[7][1].name}`],
        title: `${entries[7][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[7][0].substring(1))
        )} by ${entries[7][1].name} by ${entries[7][1].Professor} `
      },
      [entries[8][1].name]: {
        synonyms: [`${entries[8][1].name}`],
        title: `${entries[8][1].name}`,
        description: `At ${timeConvert(
          parseInt(entries[8][0].substring(1))
        )} by ${entries[8][1].name} by ${entries[8][1].Professor} `
      }
    }
  })
);
