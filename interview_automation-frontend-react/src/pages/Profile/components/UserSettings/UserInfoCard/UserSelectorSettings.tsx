import { City, Country, State } from 'country-state-city';
import { useEffect, useState } from 'react';

import Selector from './Selector';

// Визначаємо типи для країни, штату та міста
interface CountryType {
  isoCode: string;
  name: string;
}

interface StateType {
  isoCode: string;
  name: string;
  countryCode: string;
}

interface CityType {
  name: string;
  stateCode: string;
  countryCode: string;
}

function App(): JSX.Element {
  const countryData: CountryType[] = Country.getAllCountries();
  const [stateData, setStateData] = useState<StateType[] | undefined>();
  const [cityData, setCityData] = useState<CityType[] | undefined>();

  const [country, setCountry] = useState<CountryType>(countryData[0]);
  const [state, setState] = useState<StateType | undefined>();
  const [city, setCity] = useState<CityType | undefined>();

  useEffect(() => {
    setStateData(State.getStatesOfCountry(country?.isoCode));
  }, [country]);

  useEffect(() => {
    setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
  }, [state]);

  useEffect(() => {
    if (stateData) {
      setState(stateData[0]);
    }
  }, [stateData]);

  useEffect(() => {
    if (cityData) {
      setCity(cityData[0]);
    }
  }, [cityData]);

  return (
    <section className="min-h-screen px-3 grid place-items-center pb-20 selection:text-white selection:bg-teal-500 bg-gradient-to-r from-teal-400 to-teal-500">
      <div>
        <h2 className="text-2xl font-bold text-teal-900">
          Country, State and City Selectors
        </h2>
        <br />
        <div className="flex flex-wrap gap-3 bg-teal-300 rounded-lg p-8">
          <div>
            <p className="text-teal-800 font-semibold">Country :</p>
            <Selector
              data={countryData}
              selected={country}
              setSelected={setCountry}
            />
          </div>
          {state && (
            <div>
              <p className="text-teal-800 font-semibold">State :</p>
              <Selector
                data={stateData ?? []}
                selected={state}
                setSelected={setState}
              />
            </div>
          )}
          {city && (
            <div>
              <p className="text-teal-800 font-semibold">City :</p>
              <Selector
                data={cityData ?? []}
                selected={city}
                setSelected={setCity}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default App;
