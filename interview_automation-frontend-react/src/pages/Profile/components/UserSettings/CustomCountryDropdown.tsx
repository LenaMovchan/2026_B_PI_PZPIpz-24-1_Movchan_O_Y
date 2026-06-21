import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';

import styles from './UserProfileNavigator.module.scss';

interface CountryOption {
  value: string;
  label: string;
}

const countryOptions: CountryOption[] = [
  { value: 'Ukraine', label: 'Ukraine' }, 
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Andorra', label: 'Andorra' },
  { value: 'Angola', label: 'Angola' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Armenia', label: 'Armenia' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Azerbaijan', label: 'Azerbaijan' },
 
  // додайте більше країн тут
];

<Select options={countryOptions} />;

function CustomCountryDropdown(): React.JSX.Element {
  const [selectedCountry, setSelectedCountry] = useState<SingleValue<CountryOption>>(null);

  const handleChange = (selectedOption: SingleValue<CountryOption>):void=> {
    setSelectedCountry(selectedOption);
  };

  return (
    <div className={styles.main_user_settings_input_country}>
      <label htmlFor="country-select">Країна</label>
      <Select
        id="country-select"
        value={selectedCountry}
        onChange={handleChange}
        options={countryOptions}
      />
    </div>
  );
}

export default CustomCountryDropdown;

