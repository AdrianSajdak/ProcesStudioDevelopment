export const N = 1;
export const kN = 1e3;
export const m = 1;
export const cm = 0.01;
export const mm = 0.001;
export const Pa = 1;
export const kPa = 1e3;
export const MPa = 1e6;
export const GPa = 1e9;

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

export const gamma_c = 1.4;
export const alfac_c = 1.0;
export const alfa_ct = 1.0;
export const gamma_s = 1.15;
export const Es = 200 * GPa;