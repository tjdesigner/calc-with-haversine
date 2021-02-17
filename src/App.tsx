import React, { useCallback, useRef, useState } from 'react';
import './App.css';

import { SubmitHandler, FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import Input from './components/Input';

const App: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [distancia, setDistancia] = useState('0');

  const haversineFn = (lat1: number, lon1: number, lat2: number, lon2: number) => {

    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return d;
  };

  const mylocation = useCallback((d: any) => {
    const result = haversineFn(d.latLon1.substring(0, 10), d.latLon1.substring(20, 30), d.latLon2.substring(0, 10), d.latLon2.substring(20, 30));
    let resCalc = result.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.').substring(0,5).replace('.', ',');
    setDistancia(resCalc)
  },[]);
  
  const handleSubmit: SubmitHandler = useCallback((data) => {
    mylocation(data);
  }, [mylocation]);

  return (
    <>
      <div className="App">
          <h2>Calcule a distância em <b>linha reta</b> entre dois pontos</h2>
          <p>
            <code>Busque os pontos através do <a className="google" href="https://www.google.com.br/maps" target="blank">Google Maps</a></code>
          </p>
          <Form ref={formRef} onSubmit={handleSubmit}>
          <label>Cole em cada campo (Latitude e Longitude) dos pontos origem e destino.</label>
          <p>
            <Input name="latLon1" placeholder="-15.804065, -47.931580"/>
            <Input name="latLon2" placeholder="-23.565168, -46.646180"/>
          </p>
            <button className="App-link" type="submit">CALCULAR</button>
          </Form>
          { distancia !== '0' ? <h2>{distancia} Km </h2> : <h2>0 Km</h2>}
          <code><a className="git" href="https://github.com/tjdesigner/calc-with-haversine" target="blank">GitHub</a></code>
      </div>
    </>
  );
}

export default App;
