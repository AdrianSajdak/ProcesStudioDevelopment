// Jednostki
export const N = 1;
export const kN = 1e3;
export const m = 1;
export const cm = 0.01;
export const mm = 0.001;
export const Pa = 1;
export const kPa = 1e3;
export const MPa = 1e6;
export const GPa = 1e9;

// Dane materiałowe
export const betonData = [
  {
    name: 'C20/25',
    f_ck: 25 * MPa,
    f_ctm: 2.2 * MPa,
    f_ctk005: 1.5 * MPa,
    E_cm: 30 * GPa,
  },
  {
    name: 'C25/30',
    f_ck: 30 * MPa,
    f_ctm: 2.6 * MPa,
    f_ctk005: 1.8 * MPa,
    E_cm: 31 * GPa,
  },
  {
    name: 'C30/37',
    f_ck: 37 * MPa,
    f_ctm: 2.9 * MPa,
    f_ctk005: 2.0 * MPa,
    E_cm: 32 * GPa,
  },
  {
    name: 'C35/45',
    f_ck: 35 * MPa,
    f_ctm: 3.2 * MPa,
    f_ctk005: 2.2 * MPa,
    E_cm: 34 * GPa,
  },
  {
    name: 'C40/50',
    f_ck: 40 * MPa,
    f_ctm: 3.5 * MPa,
    f_ctk005: 2.5 * MPa,
    E_cm: 35 * GPa,
  },
];

export const stalData = [
  { label: '400 MPa', value: 400 * MPa },
  { label: '500 MPa', value: 500 * MPa },
  { label: '600 MPa', value: 600 * MPa },
];

export const gammac = 1.4;
export const alfacc = 1.0;
export const alfact = 1.0;
export const gammas = 1.15;
export const Es = 200 * GPa;

// Funkcje obliczeniowe
export const wymiarowaniezginanie = (MSd, b, d, fcd, fyd, Es) => {
  const Scceff = MSd / (b * Math.pow(d, 2) * fcd);
  const sqrtValue = 1 - 2 * Scceff;
  if (sqrtValue < 0) {
    return 'Błąd obliczeń!';
  }
  const ksieff = 1 - Math.sqrt(sqrtValue);
  const xeff = ksieff * d;
  const ksiefflim = 0.0035 / (0.0035 + fyd / Es);
  if (ksieff <= ksiefflim) {
    const Asreq = (xeff * b * fcd) / fyd;
    return Asreq;
  } else {
    return 'Przekrój podwójnie zbrojony!';
  }
};

export const wsppelzania = () => {
  const phi = 2.5;
  return phi;
};

export const obliczenierysy = (As, b, d, Mk, Ecm, Es, phi, alpha, h, fi, Mcr) => {
  const beta1 = 1.0;
  const beta2 = 0.5;
  const k1 = 0.8;
  const k2 = 0.5;
  const beta = 1.06;

  const rho = As / (b * d);
  const xII = d * (Math.sqrt(rho * alpha * (2 + rho * alpha)) - rho * alpha);
  const sigII = Mk / (As * (d - xII / 3));

  const eps = (sigII / Es) * (1 - beta1 * beta2 * Math.pow(Mcr / Mk, 2));

  const hef = Math.min(2.5 * (h - d), (h - xII) / 3);
  const rhor = As / (hef * b);

  const srm = 0.05 + (1 / 4) * k1 * k2 * fi / rhor;

  const wk = beta * srm * eps;
  return wk;
};

export const wymiarowanienaryse = (wkmax, As, b, d, Mk, Ecm, Es, phi, alpha, h, fi, Mcr) => {
  let EPS = 1.0;
  let i = 1;
  while (EPS > 0.005) {
    const wk = obliczenierysy(As, b, d, Mk, Ecm, Es, phi, alpha, h, fi, Mcr);
    const deltawk = wkmax - wk;
    EPS = Math.abs(deltawk) / wkmax;
    if (deltawk > 0) {
      As = As - As * EPS;
    } else {
      As = As + As * EPS;
    }
    i = i + 1;
    if (i > 1000) break;
  }
  return As;
};
