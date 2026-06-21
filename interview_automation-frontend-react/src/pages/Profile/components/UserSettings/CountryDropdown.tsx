// import React, { useState } from 'react';

// const countries = [
//   'Afghanistan',
//   'Albania',
//   'Algeria',
//   'Andorra',
//   'Angola',
//   'Argentina',
//   'Armenia',
//   'Australia',
//   'Austria',
//   'Azerbaijan'
//   // додайте більше країн тут
// ];

// function CountryDropdown(): React.JSX.Element {
//   const [selectedCountry, setSelectedCountry] = useState('');

//   const handleChange = (event) => {
//     setSelectedCountry(event.target.value);
//   };

//   return (
//     <div>
//       <label htmlFor="country">Select your country: </label>
//       <select id="country" value={selectedCountry} onChange={handleChange}>
//         <option value="">Choose a country</option>
//         {countries.map((country) => (
//           <option key={country} value={country}>
//             {country}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default CountryDropdown;
