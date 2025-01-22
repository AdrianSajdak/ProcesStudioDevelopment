// calculations.js

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
  // MSd [N*m], b [m], d [m], fcd [Pa], fyd [Pa]
  // Zwraca Asreq [m^2] lub komunikat błędu
  const Scceff = MSd / (b * Math.pow(d, 2) * fcd);
  const sqrtValue = 1 - 2 * Scceff;
  if (sqrtValue < 0) {
    return 'Błąd obliczeń!';
  }
  const ksieff = 1 - Math.sqrt(sqrtValue);
  const xeff = ksieff * d;

  // Współczynnik ksiefflim
  const ksiefflim = 0.0035 / (0.0035 + fyd / Es);

  if (ksieff <= ksiefflim) {
    const Asreq = (xeff * b * fcd) / fyd;
    return Asreq; // [m^2]
  } else {
    return 'Przekrój podwójnie zbrojony!';
  }
};

export const wsppelzania = () => {
  // Przyjęta wartość współczynnika pełzania
  const phi = 2.5;
  return phi;
};

export const obliczenierysy = (As, b, d, Mk, Ecm, Es, phi, alpha, h, fi, Mcr) => {
  // Funkcja pomocnicza do wyznaczania rozwarcia rysy
  // Parametry w jednostkach SI (m, N, Pa, itp.)
  // Zwraca wk [m]
  const beta1 = 1.0;
  const beta2 = 0.5;
  const k1 = 0.8;
  const k2 = 0.5;
  const beta = 1.06;

  const rho = As / (b * d);
  // xII - d*(...)
  const xII = d * (Math.sqrt(rho * alpha * (2 + rho * alpha)) - rho * alpha);

  // Naprężenie w zbrojeniu w fazie II
  const sigII = Mk / (As * (d - xII / 3));

  // Odkształcenie
  const eps = (sigII / Es) * (1 - beta1 * beta2 * Math.pow(Mcr / Mk, 2));

  // hef
  const hef = Math.min(2.5 * (h - d), (h - xII) / 3);
  const rhor = As / (hef * b);

  // srm
  const srm = 0.05 + (1 / 4) * k1 * k2 * (fi) / rhor;

  // rozwarcie rysy
  const wk = beta * srm * eps;
  return wk;
};

export const wymiarowanienaryse = (
  wkmax,
  As,
  b,
  d,
  Mk,
  Ecm,
  Es,
  phi,
  alpha,
  h,
  fi,
  Mcr
) => {
  // Iteracyjne wymiarowanie zbrojenia na zarysowanie
  let EPS = 1.0;
  let i = 1;
  while (EPS > 0.005) {
    const wk = obliczenierysy(As, b, d, Mk, Ecm, Es, phi, alpha, h, fi, Mcr);
    const deltawk = wkmax - wk;
    EPS = Math.abs(deltawk) / wkmax;
    if (deltawk > 0) {
      // za duże zbrojenie => zmniejszamy
      As = As - As * EPS;
    } else {
      // za małe zbrojenie => zwiększamy
      As = As + As * EPS;
    }
    i += 1;
    if (i > 1000) break;
  }
  return As;
};

/**
 * Obliczenia nośności na ścinanie wg zarysu z obrazka (EC2 – uproszczona procedura).
 * VEd [kN], b [m], d [m], fck [Pa], fyk [Pa], Asl [cm^2] => zbrojenie podłużne w strefie rozciąganej
 *
 * Zwraca obiekt z wartościami:
 * {
 *   VRd_c,  // kN
 *   vRd_c,  // MPa
 *   vRd_max, // MPa
 *   VRd_max, // kN
 *   neededShearReinf: boolean,
 *   AswPerMeter, // [cm^2/m] wymagane do przejęcia (VEd - VRd_c)
 *   sRecommended, // cm - zalecany rozstaw strzemion, jeżeli podamy n_sw i fi_sw
 *   message
 * }
 */
export const wymiarowanieScinanie = (
  VEd,    // kN
  b,      // m
  d,      // m
  fck,    // Pa
  fyk,    // Pa
  Asl,    // cm^2
  n_sw,   // liczba ramion w jednym strzemieniu
  fi_sw   // mm
) => {
  // Konwersje
  const VEd_N = VEd * 1e3;        // [N]
  const b_mm = b / mm;           // [mm]
  const d_mm = d / mm;           // [mm]
  const fckMPa = fck / 1e6;      // [MPa]
  const fykMPa = fyk / 1e6;      // [MPa]
  const fyd = fyk / gammas;      // [Pa]

  // Zbrojenie podłużne Asl (cm^2) => mm^2
  const Asl_mm2 = Asl * 100.0; // 1 cm^2 = 100 mm^2

  // Współczynniki wg EC2
  const cRd_c = 0.18 / gammac; // 0.18/gamma_c
  // k
  const k = Math.min(1 + 200 / d_mm, 2.0);

  // rho_l = Asl/(b*d) w sensie mm^2 / mm^2 (bezwymiarowe)
  const rho_l = Asl_mm2 / (b_mm * d_mm);

  // Podstawowe vRd,c [MPa]
  let vRd_c = cRd_c * Math.pow(k, 1.5) * Math.pow(100 * rho_l * fckMPa, 1.0 / 3.0);

  // v_min
  const v_min = 0.035 * Math.pow(k, 1.5) * Math.sqrt(fckMPa);

  // bierzemy max z vRd_c i v_min
  vRd_c = Math.max(vRd_c, v_min);

  // vRd.max = 0.4 * v * sqrt(fck) wg obrazka
  // gdzie v = 0.6*(1 - f_ck/250)  (z dokumentu)
  const v = 0.6 * (1 - fckMPa / 250);
  const vRd_max = 0.4 * v * Math.sqrt(fckMPa);

  // VRd,c [N] => vRd_c [MPa] * b_mm*d_mm => N => kN
  const VRd_c = (vRd_c * b_mm * d_mm) / 1e3; // [kN]
  // VRd,max
  const VRd_max = (vRd_max * b_mm * d_mm) / 1e3; // [kN]

  // Sprawdzamy, czy ścinanie przekracza VRd_c
  let neededShearReinf = false;
  let message = '';
  let AswPerMeter = 0; // [cm^2/m]
  let sRecommended = 0; // [cm]

  if (VEd <= VRd_c) {
    neededShearReinf = false;
    message = 'Zbrojenie na ścinanie NIEPOTRZEBNE';
  } else {
    // sprawdzamy też, czy nie przekracza VRd.max
    if (VEd > VRd_max) {
      message =
        'V_Ed przekracza nośność maksymalną sekcji (VRd,max). Niewykonalne samymi strzemionami!';
      neededShearReinf = true;
    } else {
      neededShearReinf = true;
      message = 'Wymagane zbrojenie na ścinanie';

      // Obliczenie A_sw/s (mm^2/mm) wg standardowego wzoru EC2:
      // V_Ed - V_Rd,c = (A_sw/s)*z*f_ywd * cot(theta)
      // Załóżmy theta ~ 26.6 => cot theta ~ 2
      const thetaDeg = 26.6;
      const thetaRad = (thetaDeg * Math.PI) / 180;
      const cotTheta = 1 / Math.tan(thetaRad);

      // f_ywd
      const f_ywd = fyd; // [Pa] = N/m^2 => w MPa => f_ywd / 1e6

      // z ~ 0.9*d
      const z_mm = 0.9 * d_mm;

      const dV = (VEd_N - VRd_c * 1e3); // [N]
      // A_sw/s [mm^2/mm]
      const Asw_s_mm2_mm = dV / (z_mm * f_ywd * cotTheta);

      // chcemy A_sw/s w [cm^2/m]
      // konwersja mm^2/mm -> cm^2/m = *10
      AswPerMeter = Asw_s_mm2_mm * 10; // [cm^2/m]

      // Możemy też zasugerować rozstaw s, jeśli użytkownik poda n_sw i fi_sw:
      // Pole 1 strzemienia (n ramion) = n_sw * (π * fi_sw^2 / 4) [mm^2]
      const As_oneStirrup_mm2 = n_sw * (Math.PI * Math.pow(fi_sw, 2) / 4);

      // konwersja na cm^2
      const As_oneStirrup_cm2 = As_oneStirrup_mm2 / 100.0;

      // Jeśli potrzebujemy X [cm^2/m], a jedno strzemię ma Y cm^2, to s (w metrach) <= Y / X
      // Potem na cm => *100
      if (AswPerMeter > 0) {
        const s_m = As_oneStirrup_cm2 / AswPerMeter; // [m]
        sRecommended = s_m * 100; // [cm]
      }
    }
  }

  return {
    VRd_c,
    vRd_c,
    vRd_max,
    VRd_max,
    neededShearReinf,
    AswPerMeter,
    sRecommended,
    message,
  };
};
