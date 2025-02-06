import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

import {
  kN,
  m,
  cm,
  mm,
  betonData,
  stalData,
  gamma_c,
  alfac_c,
  gamma_s,
  Es,
} from '../utils/const_variables';

import {
  calculateEffectiveDepth,
  calculateMcr,
  wymiarowaniezginanie,
  wsppelzania,
  obliczenierysy,
  wymiarowanienaryse,
} from './reinforcement_calculations';

const ReinforcementDimensioning = () => {
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0);

  const [klasaBetonu, setKlasaBetonu] = useState(betonData[2]);
  const [klasaStali, setKlasaStali] = useState(stalData[1]);

  const [fck, setFck] = useState(klasaBetonu.f_ck);
  const [fctm, setFctm] = useState(klasaBetonu.f_ctm);
  const [Ecm, setEcm] = useState(klasaBetonu.E_cm);
  const [fcd, setFcd] = useState((alfac_c * klasaBetonu.f_ck) / gamma_c);
  const [fyk, setFyk] = useState(klasaStali.value);
  const [fyd, setFyd] = useState(klasaStali.value / gamma_s);

  const [MSd, setMSd] = useState(0);
  const [h, setH] = useState(0 * cm);
  const [b, setB] = useState(0 * cm);
  const [cnom, setCnom] = useState(0 * mm);
  const [fi, setFi] = useState(20 * mm);
  const [d, setD] = useState(0);

  const [Asreq, setAsreq] = useState(1.0 * cm * cm);
  const [resultAsreq, setResultAsreq] = useState(null);

  const [Mcr, setMcr] = useState(0);
  const [Mk, setMk] = useState(0);
  const [Asprov, setAsprov] = useState(Asreq);
  const [wk, setWk] = useState(0);
  const [calculateRysa, setCalculateRysa] = useState(false);
  const [wkmax, setWkmax] = useState(0.3 * mm);
  const [Asreq3, setAsreq3] = useState(Asreq);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCalculateAsreq = () => {
    const result = wymiarowaniezginanie(MSd * kN * m, b, d, fcd, fyd, Es);
    setResultAsreq(result);
  };

  const handleCalculateWk = () => {
    const phi = wsppelzania();
    const alpha = (Es / Ecm) * (1 + phi);
    const wkResult = obliczenierysy(Asprov, b, d, Mk * kN * m, Ecm, Es, phi, alpha, h, fi, Mcr);
    setWk(wkResult);
  };

  const handleCalculateAsreq3 = () => {
    const phi = wsppelzania();
    const alpha = (Es / Ecm) * (1 + phi);
    const Asreq3Result = wymiarowanienaryse(wkmax, Asreq, b, d, Mk * kN * m, Ecm, Es, phi, alpha, h, fi, Mcr);
    setAsreq3(Asreq3Result);
  };

  const handleKlasaBetonuChange = (event) => {
    const selectedBeton = betonData.find(
      (beton) => beton.name === event.target.value
    );
    setKlasaBetonu(selectedBeton);
    setFck(selectedBeton.f_ck);
    setFctm(selectedBeton.f_ctm);
    setEcm(selectedBeton.E_cm);
    setFcd((alfac_c * selectedBeton.f_ck) / gamma_c);
  };

  const handleKlasaStaliChange = (event) => {
    const selectedStal = stalData.find(
      (stal) => stal.value === event.target.value
    );
    setKlasaStali(selectedStal);
    setFyk(selectedStal.value);
    setFyd(selectedStal.value / gamma_s);
  };

  useEffect(() => {
    setD(calculateEffectiveDepth(h, cnom, fi));
  }, [h, cnom, fi]);

  useEffect(() => {
    setMcr(calculateMcr(fctm, b, d));
  }, [fctm, b, d]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        minHeight: '50vh',
        borderRadius: 2,
        p: 2,
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <Typography variant="h4" align="center">
        Wymiarowanie zbrojenia
      </Typography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="tabs"
        sx={{ 
          mb: 2,
          '& .MuiTabs-flexContainer': {
            justifyContent: 'center'
          }
        }}
        textColor="inherit"
        TabIndicatorProps={{ style: { backgroundColor: theme.palette.violet.light } }}
      >
        <Tab label="Dane materiałowe" />
        <Tab label="Zginanie [SGN]" />
        <Tab label="Zarysowanie [SGU]" />
        <Tab label="Ugięcie [SGU]" />
      </Tabs>

      {/* Dane materiałowe */}
      {tabValue === 0 && (
        <Box p={2}>
          <Typography variant="h5" align="center">
            Zginanie [SGN]
          </Typography>
          <Box mt={2}>
            <FormControl fullWidth>
              <InputLabel>Klasa betonu</InputLabel>
              <Select
                value={klasaBetonu.name}
                label="Klasa betonu"
                onChange={handleKlasaBetonuChange}
              >
                {betonData.map((beton) => (
                  <MenuItem key={beton.name} value={beton.name}>
                    {beton.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Klasa stali</InputLabel>
              <Select
                value={klasaStali.value}
                label="Klasa stali"
                onChange={handleKlasaStaliChange}
              >
                {stalData.map((stal) => (
                  <MenuItem key={stal.value} value={stal.value}>
                    {stal.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      {/* Zginanie [SGN] */}
      {tabValue === 1 && (
        <Box p={2}>
          <Typography variant="h5" align="center">
            Zginanie [SGN]
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              label="Moment obl. [kN*m]"
              type="number"
              value={MSd}
              onChange={(e) => setMSd(parseFloat(e.target.value))}
              fullWidth
              InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              margin="normal"
            />
            <Divider sx={{ my: 2 }} />
            <TextField
              label="Wysokość przekroju [cm]"
              type="number"
              value={h / cm}
              onChange={(e) => setH(parseFloat(e.target.value) * cm)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Szerokość przekroju [cm]"
              type="number"
              value={b / cm}
              onChange={(e) => setB(parseFloat(e.target.value) * cm)}
              fullWidth
              margin="normal"
            />
            <Divider sx={{ my: 2 }} />
            <TextField
              label="Otulina [mm]"
              type="number"
              value={cnom / mm}
              onChange={(e) => setCnom(parseFloat(e.target.value) * mm)}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Średnica zbrojenia fi [mm]</InputLabel>
              <Select
                value={fi / mm}
                label="Średnica zbrojenia [mm]"
                onChange={(e) => setFi(parseFloat(e.target.value) * mm)}
              >
                {[8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 30, 32, 36, 40].map(
                  (diameter) => (
                    <MenuItem key={diameter} value={diameter}>
                      {diameter}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleCalculateAsreq}
                sx={{
                  backgroundColor: 'violet.main',
                  '&:hover': { backgroundColor: 'violet.light' },
                }}
              >
                Oblicz
              </Button>
            </Box>

            {resultAsreq && (
              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Wymagane pole zbrojenia na zginanie:{' '}
                <strong>
                  {typeof resultAsreq === 'number'
                    ? `Asreq = ${(resultAsreq / (cm * cm)).toFixed(2)} cm²`
                    : resultAsreq}
                </strong>
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Zarysowanie [SGU] */}
      {tabValue === 2 && (
        <Box p={2}>
          <Typography variant="h5" align="center">
            Zarysowanie [SGU]
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <Typography variant="body1" align="center">
              Moment rysujący Mcr = {(Mcr / (kN * m)).toFixed(2)} kNm
            </Typography>
            <Divider sx={{ my: 2 }} />
            <TextField
              label="Moment Qp/Char. [kN*m]"
              type="number"
              value={Mk}
              onChange={(e) => setMk(parseFloat(e.target.value))}
              fullWidth
              margin="normal"
            />
            <Divider sx={{ my: 2 }} />
            <TextField
              label="Zadane pole zbrojenia [cm²]"
              type="number"
              value={Asprov / (cm * cm)}
              onChange={(e) => setAsprov(parseFloat(e.target.value) * cm * cm)}
              fullWidth
              margin="normal"
            />
            <Box align="center">
              <Button
                variant="contained"
                onClick={handleCalculateWk}
                sx={{
                  mt: 2,
                  backgroundColor: 'violet.main',
                  '&:hover': { backgroundColor: 'violet.light' },
                }}
              >
                Oblicz ryse
              </Button>
            </Box>

            {wk !== 0 && (
              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Rozwarcie rysy dla przyjętego zbrojenia wk ={' '}
                {(wk / mm).toFixed(2)} mm
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={calculateRysa}
                  onChange={(e) => setCalculateRysa(e.target.checked)}
                />
              }
              label="Wymiarowanie zbrojenia dla maksymalnej rozwarcia rysy"
            />
            {calculateRysa && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>
                    Graniczna wartość rozwarcia rysy wkmax [mm]
                  </InputLabel>
                  <Select
                    value={wkmax / mm}
                    label="Graniczna wartość rozwarcia rysy wkmax [mm]"
                    onChange={(e) => setWkmax(parseFloat(e.target.value) * mm)}
                  >
                    {[0.1, 0.2, 0.3, 0.4].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box align="center">
                  <Button
                    variant="contained"
                    onClick={handleCalculateAsreq3}
                    sx={{
                      mt: 2,
                      backgroundColor: 'violet.main',
                      '&:hover': { backgroundColor: 'violet.light' },
                    }}
                  >
                    Oblicz zbrojenie
                  </Button>
                </Box>

                {Asreq3 !== 0 && (
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Wymagane pole zbrojenia na zarysowanie: Asreq ={' '}
                    {(Asreq3 / (cm * cm)).toFixed(2)} cm²
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Ugięcie [SGU] */}
      {tabValue === 3 && (
        <Box p={2}>
          <Typography variant="h5">Ugięcie [SGU]</Typography>
          <Typography variant="body1">
            Klasa betonu: {klasaBetonu.name}
          </Typography>
          <Typography variant="body1">
            Klasa stali: {klasaStali.label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReinforcementDimensioning;