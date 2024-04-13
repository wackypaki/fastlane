document.addEventListener('DOMContentLoaded', async () => {
  const yearsDropdown = document.getElementById('yearDropdown');
  const makesDropdown = document.getElementById('makeDropdown');
  const modelsDropdown = document.getElementById('modelDropdown');

  const fetchYears = async () => {
    const response = await fetch('/years');
    const years = await response.json();
    years.forEach(year => {
      const option = document.createElement('option');
      option.text = year;
      yearsDropdown.add(option);
    });
  };

  const fetchMakes = async () => {
    const response = await fetch('/makes');
    const makes = await response.json();
    makes.forEach(make => {
      const option = document.createElement('option');
      option.text = make;
      makesDropdown.add(option);
    });
  };

  const fetchModels = async () => {
    const response = await fetch('/models');
    const models = await response.json();
    models.forEach(model => {
      const option = document.createElement('option');
      option.text = model;
      modelsDropdown.add(option);
    });
  };

  await fetchYears();
  await fetchMakes();
  await fetchModels();
});