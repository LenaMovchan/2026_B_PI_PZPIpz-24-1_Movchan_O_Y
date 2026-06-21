// import { City, Country, State } from 'country-state-city';
// import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import userDefaultPhoto from '../../../../../assets/default-full-photo.svg';
import iconPen from '../../../../../assets/icon-pen.svg';
import Input from '../../../../Auth/components/Input';
import styles from '../UserProfileNavigator.module.scss';
import CustomCountryDropdown from '../CustomCountryDropdown';
// import Selector from './Selector';

// interface CountryType {
//   isoCode: string;
//   name: string;
// }

// interface StateType {
//   isoCode: string;
//   name: string;
//   countryCode: string;
// }

// interface CityType {
//   name: string;
//   stateCode: string;
//   countryCode: string;
// }

function UserInfoCard(): React.JSX.Element {
  // const countryData: CountryType[] = Country.getAllCountries();
  // const [stateData, setStateData] = useState<StateType[] | undefined>();
  // const [cityData, setCityData] = useState<CityType[] | undefined>();

  // const [country, setCountry] = useState<CountryType>(countryData[0]);
  // const [state, setState] = useState<StateType | undefined>();
  // const [city, setCity] = useState<CityType | undefined>();

  // useEffect(() => {
  //   setStateData(State.getStatesOfCountry(country?.isoCode));
  // }, [country]);

  // useEffect(() => {
  //   setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
  // }, [state]);

  // useEffect(() => {
  //   if (stateData) {
  //     setState(stateData[0]);
  //   }
  // }, [stateData]);

  // useEffect(() => {
  //   if (cityData) {
  //     setCity(cityData[0]);
  //   }
  // }, [cityData]);

  const handleChange = (): void => {};
  return (
    <div className={styles.main_user_settings}>
      <div className={styles.main_user_settings_title}>Особиста інформація</div>
      <div className={styles.main_user_settings_photo}>
        <img
          src={userDefaultPhoto}
          alt="User Default"
          className={styles.user_default_photo}
        />
        <div className={styles.user_icon_container}>
          <Link className={styles.icon_pen} to="/">
            <img src={iconPen} alt="Edit pen" />
          </Link>
        </div>
      </div>
      <div className={styles.main_user_settings_input_name}>
        <Input
          inputName="Прізвище та ім'я"
          type="text"
          id="login"
          placeholder="Введіть прізвище та ім'я"
          error={undefined}
        />
      </div>
      <div className={styles.main_user_settings_input_username}>
        <Input
          inputName="Користувацьке ім'я"
          type="text"
          id="password"
          placeholder="Введіть користувацьке ім'я"
          error={undefined}
        />
      </div>
      <div className={styles.main_user_settings_location}>
        <div className={styles.main_user_settings_input_country}>
          {/* <p className="text-teal-800 font-semibold">Країна:</p>
          <Selector data={countryData} selected={country} selected={setCountry} /> */}
        </div>
        {/* {state && (
          <div className={styles.main_user_settings_input_state}>
            <p className="text-teal-800 font-semibold">Штат:</p>
            <Selector data={stateData ?? []} selected={state} selected={setState} />
          </div>
        )}
        {city && (
          <div className={styles.main_user_settings_input_town}>
            <p className="text-teal-800 font-semibold">Місто:</p>
            <Selector data={cityData ?? []} selected={city} selected={setCity} />
          </div>
        )} */}

        {/* <Input
          className={styles.main_user_settings_input_country}
          inputName="Країна"
          type="text"
          id="login"
          placeholder="country"
          error={undefined}
        /> */}

        <CustomCountryDropdown />
        <Input
          className={styles.main_user_settings_input_town}
          inputName="Місто"
          type="select"
          id="login"
          placeholder="town"
          error={undefined}
        />
        <button
          type="button"
          onClick={handleChange}
          className={styles.submitChangePassword}
        >
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}

export default UserInfoCard;
