import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Paper,
  Grid,
} from "@mui/material";

import {
  betonData,
  stalData,
} from "../utils/const_variables";
import {
  calcConcreteShearCapacity,
  calcAswRequiredAndSpacing,
} from "./slicing_calculations";

const Slicing = () => {
  // ---------- STANY DANYCH WEJŚCIOWYCH ----------
  // Dla przykładu, poniżej zadeklarowane stany w oparciu o wymagane parametry.

  // 1) Wybór betonu
  const [selectedConcrete, setSelectedConcrete] = useState(betonData[0]);

  // 2) Wybór stali (f_yk)
  const [selectedSteel, setSelectedSteel] = useState(stalData[0]);

  // 3) Dane do obliczeń nośności betonu na ścinanie
  const [VEd, setVEd] = useState("");
  const [b, setB] = useState("");
  const [d, setD] = useState("");

  // Checkbox czy uwzględniać Asl
  const [useAsl, setUseAsl] = useState(false);
  const [Asl, setAsl] = useState("");

  // 4) Dane do obliczeń wymaganej ilości zbrojenia na ścinanie
  const [theta, setTheta] = useState("");
  const [phiSw, setPhiSw] = useState("");
  const [nSw, setNSw] = useState("");

  // ---------- STANY DLA WYNIKÓW ----------
  // Wyniki z calcConcreteShearCapacity
  const [vRdC, setVRdC] = useState(null);
  const [vRdMax, setVRdMax] = useState(null);
  const [VRdC, setVRdC_kN] = useState(null);

  // Wyniki z calcAswRequiredAndSpacing
  const [aSwReq, setASwReq] = useState(null);
  const [sMin, setSMin] = useState(null);

  // ---------- OBSŁUGA OBLICZEŃ ----------
  const handleCalculate = () => {
    try {
      const concreteShearResults = calcConcreteShearCapacity({
        V_Ed: parseFloat(VEd),
        b: parseFloat(b),
        d: parseFloat(d),
        f_ck: selectedConcrete.f_ck, // Wartość z wybranej pozycji betonu
        useAsl: useAsl,
        Asl: parseFloat(Asl) || 0,
      });

      setVRdC(concreteShearResults.v_Rd_c);
      setVRdMax(concreteShearResults.v_Rd_max);
      setVRdC_kN(concreteShearResults.V_Rd_c);

      const aswResults = calcAswRequiredAndSpacing({
        V_Ed: parseFloat(VEd),
        d: parseFloat(d),
        f_yk: selectedSteel.value,
        theta: parseFloat(theta),
        phi_sw: parseFloat(phiSw),
        n_sw: parseFloat(nSw),
      });

      setASwReq(aswResults.A_sw_req);
      setSMin(aswResults.s_min);
    } catch (error) {
      console.error("Błąd obliczeń:", error.message);
      alert("Wystąpił błąd podczas obliczeń: " + error.message);
    }
  };

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant="h5" align="center">
        Obliczenia Ścinania
      </Typography>

      <Grid container spacing={2}>

        {/* SEKCJA WYBORU BETONU */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="concrete-select-label">Klasa Betonu</InputLabel>
            <Select
              labelId="concrete-select-label"
              value={selectedConcrete}
              label="Beton"
              onChange={(e) => setSelectedConcrete(e.target.value)}
            >
              {betonData.map((beton) => (
                <MenuItem key={beton.name} value={beton}>
                  {beton.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* SEKCJA WYBORU STALI */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="steel-select-label">Klasa Stali</InputLabel>
            <Select
              labelId="steel-select-label"
              value={selectedSteel}
              label="Stal"
              onChange={(e) => setSelectedSteel(e.target.value)}
            >
              {stalData.map((steel) => (
                <MenuItem key={steel.label} value={steel}>
                  {steel.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Siła ścinająca V_Ed */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="V_Ed [kN]"
            value={VEd}
            onChange={(e) => setVEd(e.target.value)}
            type="number"
          />
        </Grid>

        {/* Szerokość b */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Szerokość przekroju b [mm]"
            value={b}
            onChange={(e) => setB(e.target.value)}
            type="number"
          />
        </Grid>

        {/* Wysokość użyteczna d */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Wysokość użyteczna d [mm]"
            value={d}
            onChange={(e) => setD(e.target.value)}
            type="number"
          />
        </Grid>

        {/* Checkbox - czy używamy Asl */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useAsl}
                onChange={() => setUseAsl(!useAsl)}
              />
            }
            label="Zbrojenie podłużne (Asl)"
          />
        </Grid>

        {/* Asl - pole zbrojenia podłużnego (tylko jeśli checkbox jest zaznaczony) */}
        {useAsl && (
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Pole zbrojenia podłużnego Asl [cm²]"
              value={Asl}
              onChange={(e) => setAsl(e.target.value)}
              type="number"
            />
          </Grid>
        )}

        {/* Theta */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Kąt θ [°]"
            value={theta}
            onChange={(e) => setTheta(e.target.value)}
            type="number"
          />
        </Grid>

        {/* Średnica strzemion phi_sw */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Średnica strzemion φ_sw [mm]"
            value={phiSw}
            onChange={(e) => setPhiSw(e.target.value)}
            type="number"
          />
        </Grid>

        {/* Liczba ramion strzemion n_sw */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Liczba ramion strzemion n_sw"
            value={nSw}
            onChange={(e) => setNSw(e.target.value)}
            type="number"
          />
        </Grid>

        {/* Przycisk 'Oblicz' */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleCalculate}
            sx={{ backgroundColor: 'violet.main', '&:hover': { backgroundColor: 'violet.light' } }}
          >
            Oblicz
          </Button>
        </Grid>
      </Grid>

      {/* WYŚWIETLANIE WYNIKÓW */}
      <Box mt={4}>
        <Typography variant="h6">Wyniki:</Typography>

        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          <strong>Nośność betonu na ścinanie (calcConcreteShearCapacity):</strong>
        </Typography>
        <Typography>v_Rd_c [kPa]: {vRdC !== null ? vRdC.toFixed(3) : "-"}</Typography>
        <Typography>v_Rd_max [MPa]: {vRdMax !== null ? vRdMax.toFixed(3) : "-"}</Typography>
        <Typography>V_Rd_c [kN]: {VRdC !== null ? VRdC.toFixed(2) : "-"}</Typography>

        <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
          <strong>Wymagane zbrojenie na ścinanie (calcAswRequiredAndSpacing):</strong>
        </Typography>
        <Typography>A_sw_req [cm²/m]: {aSwReq !== null ? aSwReq.toFixed(2) : "-"}</Typography>
        <Typography>
          s_min [cm] :{" "}
          {sMin !== null ? sMin.toFixed(2) : "-"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Slicing;
