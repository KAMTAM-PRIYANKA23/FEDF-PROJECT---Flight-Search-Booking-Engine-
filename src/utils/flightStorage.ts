export const getSavedFlights = () => {
  const flights = localStorage.getItem('skywings_flights');

  return flights ? JSON.parse(flights) : [];
};

export const saveFlights = (flights: any[]) => {
  localStorage.setItem(
    'skywings_flights',
    JSON.stringify(flights)
  );
};