let matrixwortStd = {
  wort: null,
  koord: null,
  vorkoord: null,
  detailgrad: null,
  mark: {
    ursprung: false,
    start: false,
    abu: false, // Abzweigung Überblick nach x abu = x-1, y abu = y-1
    abd: false, // Abzweigung Details nach x abd = x+1, y abd = y+1
  },
};

const matrixwortUr = wort => ({
  ...matrixwortStd,
  wort,
  koord: {x:0, y:0},
  detailgrad: 0.5,
  mark: {
    ursprung: true,
    start: true,
    abu: false, // Abzweigung Überblick nach x abu = x-1, y abu = y-1
    abd: false, // Abzweigung Details nach x abd = x+1, y abd = y+1
  },
});

module.exports = {
  matrixwortStd,
  matrixwortUr,
} 