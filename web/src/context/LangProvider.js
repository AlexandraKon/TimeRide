import { createContext, useState, useEffect} from 'react';
import {IntlProvider} from 'react-intl';

import MensajesIngles from './../lang/en-US.json';
import MensajesEspañol from './../lang/es-MX.json';
import MensajesCatalan from './../lang/ca-ES.json';
import useLocalStorage from 'hooks/useLocalStorage';

const langContext = createContext();

const LangProvider = ({ children }) => {
  const [mensajes, establecerMensajes] = useState({});
  const [idioma, establecerIdioma] = useLocalStorage('lang', 'en-US');

  useEffect(() => {
    switch (idioma) {
      case 'es-MX':
        establecerMensajes(MensajesEspañol);
        break;
      case 'ca-ES':
        establecerMensajes(MensajesCatalan);
        break;
      default:
        establecerMensajes(MensajesIngles);
        break;
    }
  }, [idioma]);

  const establecerLenguaje = (lenguaje) => {
    establecerIdioma(lenguaje);
  };

  return (
    <langContext.Provider value={{ idioma, establecerLenguaje }}>
      <IntlProvider locale={idioma} messages={mensajes}>
        {children}
      </IntlProvider>
    </langContext.Provider>
  );
};

export {LangProvider, langContext};