import { MPa, mm, cm, gamma_c, gamma_s } from "../utils/const_variables.js";

/**
 * Oblicza v_Rd,c (MPa),v_Rd,max (MPa) i V_Rd,c (kN).
 * @param {Object} params - Parametry wejściowe
 * @param {number} params.V_Ed - Siła ścinająca [kN]
 * @param {number} params.d - Wysokość użyteczna przekroju [mm]
 * @param {number} params.b - Szerokość przekroju [mm]
 * @param {number} params.f_ck - Wytrzymałość betonu [MPa]
 * @param {number} params.useAsl - Czy uwzględniać zbrojenie podłużne [-]
 * @param {number} params.Asl - Pole zbrojenia podłużnego [cm²]
 * @returns {Object} v_Rd_c [MPa], v_Rd_max [MPa], V_Rd_c [kN], isShearReinforcementNeeded [boolean]
 */

export function calc_k({ d }) {
  return Math.min(2.0, 1 + Math.sqrt(200 / d));
}

export function calc_C_Rd_c() {
  return 0.18 / gamma_c;
}

// PERCENTAGE VALUE RETURNED
export function calc_p_l({ Asl, b, d }) {
  const Asl_m2 = Asl * (cm * cm);
  const b_m = b * mm;
  const d_m = d * mm;

  return Asl_m2 / (b_m * d_m);
}

// VALUE RETURNED IN MPa
export function calc_basic_v_Rd_c({ C_Rd_c, k, f_ck, p_l }) {
  return C_Rd_c * k * Math.pow(100 * p_l * f_ck, 1 / 3);
}

// VALUE RETURNED IN MPa
export function calc_v_Rd_c_min({ f_ck, k }) {
  return 0.035 * Math.pow(k, 3 / 2) * Math.pow(f_ck, 1 / 2);
}

// VALUE RETURNED IN MPa TURNED INTO kPa
export function calc_final_v_Rd_c({ v_Rd_c, v_Rd_c_min }) {
  return Math.max(v_Rd_c, v_Rd_c_min) * 1000;
}

// VALUE RETURNED IN MPa
export function calc_f_cd({ f_ck }) {
  return f_ck / gamma_c;
}

export function calc_v({ f_ck }){
  return 0.6 * (1 - (f_ck / 250));
}

// VALUE RETURNED IN MPa
export function calc_v_Rd_max({ v, f_cd }){
  return 0.4 * v * f_cd;
}

// VALUE RETURNED IN kN
export function calc_V_Rd_c({ v_Rd_c, b, d }) {
  const b_m = b * mm;
  const d_m = d * mm;

  return (v_Rd_c * (b_m * d_m));
}

export function calcConcreteShearCapacity({
  V_Ed,
  b,
  d,
  f_ck,
  useAsl,
  Asl,
}) {
  if (!useAsl) {
    Asl = 0;
  }
  // Fck jest zamienione na Pa a my chcemy w MPa
  f_ck = f_ck / MPa;

  // DATA VALIDATION
  if (V_Ed < 0) throw new Error("Siła ścinająca (V_Ed) nie może być ujemna");
  if (b <= 0) throw new Error("Szerokość przekroju (b) musi być większa od 0");
  if (d <= 0) throw new Error("Wysokość użyteczna (d) musi być większa od 0");
  if (Asl < 0) throw new Error("Pole zbrojenia podłużnego nie może być ujemne");

  const k = calc_k({ d });
  const C_Rd_c = calc_C_Rd_c();
  const p_l = calc_p_l({ Asl, b, d });
  let v_Rd_c = calc_basic_v_Rd_c({ C_Rd_c, k, f_ck, p_l });
  const v_Rd_c_min = calc_v_Rd_c_min({ f_ck, k });

  // v_Rd_c
  v_Rd_c = calc_final_v_Rd_c({ v_Rd_c, v_Rd_c_min });

  const f_cd = calc_f_cd({ f_ck });
  const v = calc_v({f_ck});

  // v_Rd_max
  const v_Rd_max = calc_v_Rd_max({ v, f_cd });

  // V_Rd_c
  const V_Rd_c = calc_V_Rd_c({ v_Rd_c, b, d });

  const isShearReinforcementNeeded = (V_Ed > V_Rd_c);

  return {
    v_Rd_c,
    v_Rd_max,
    V_Rd_c,
    isShearReinforcementNeeded
  };
}

/**
 * Oblicza wymagane pole zbrojenia na ścinanie (A_sw,req) i minimalny rozstaw (s_min).
 * @param {Object} params - Parametry wejściowe
 * @param {number} params.V_Ed - Siła ścinająca [kN]
 * @param {number} params.d - Wysokość użyteczna przekroju [mm]
 * @param {number} params.f_yk - Granica plastyczności stali [MPa]
 * @param {number} params.theta - Kąt nachylenia krzyżulców ściskanych [°]
 * @param {number} params.phi_sw - Średnica prętów strzemienia [mm]
 * @param {number} params.n_sw - Liczba ramion strzemion [-]
 * @returns {Object} Wymagane pole zbrojenia [cm²/m] i minimalny rozstaw [mm]
 */

// VALUE RETURNED IN m²
export function calc_As(phi_sw) {
  return Math.PI * Math.pow(phi_sw, 2) / 4;
}

// VALUE RETURNED IN m²
export function calc_A_sw({n_sw, A_s}) {
  return n_sw * A_s;
}

export function calc_f_yd({ f_yk }) {
  return f_yk / gamma_s;
}

// VALUE RETURNED IN cm²/m
export function calc_A_sw_req({V_Ed, d, f_yd, theta}) {
  const thetaRad = (theta * Math.PI) / 180;
  const cotTheta = 1 / Math.tan(thetaRad); 

  return V_Ed / (0.9 * d * f_yd * cotTheta) / (cm * cm);
}

// VALUE RETURNED IN mm
export function calc_S_min({A_sw, A_sw_req}) {
  return A_sw / A_sw_req;
}

export function calcAswRequiredAndSpacing({
  V_Ed,
  d,
  f_yk,
  theta,
  phi_sw,
  n_sw,
}) {
  // DATA VALIDATION
  if (V_Ed <= 0) throw new Error("Siła ścinająca musi być większa od 0");
  if (d <= 0) throw new Error("Wysokość użyteczna musi być większa od 0");
  if (theta <= 0 || theta >= 90) throw new Error("Kąt theta musi być w zakresie (0°, 90°)");
  if (phi_sw <= 0) throw new Error("Średnica strzemion musi być większa od 0");
  if (n_sw < 2) throw new Error("Liczba ramion strzemion musi być >= 2");

  // Fyk jest wprzekazywane jako Pa a my chcemy Mpa

  f_yk = f_yk / MPa;

  // ADDITIONAL CALCULATIONS
  const A_s = calc_As(phi_sw);
  const A_sw = calc_A_sw({n_sw, A_s});
  const f_yd = calc_f_yd({ f_yk });

  // A_sw,req CALCULATION
  const A_sw_req = calc_A_sw_req({V_Ed, d, f_yd, theta});

  // s_min CALCULATION
  const s_min = calc_S_min({A_sw, A_sw_req});

  return {
    A_sw_req,
    s_min,
  };
}