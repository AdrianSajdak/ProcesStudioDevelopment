export const calculateEffectiveDepth = (h, cnom, fi) => {
  return h - cnom - fi;
};

export const calculateMcr = (fctm, b, d) => {
  return (fctm * b * Math.pow(d, 2)) / 6;
};

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
