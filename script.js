document.addEventListener('DOMContentLoaded', async () => {
  const makesDropdown = document.getElementById('makeDropdown');
  const modelsDropdown = document.getElementById('modelDropdown');
  const generationsDropdown = document.getElementById('generationDropdown'); // Update to match your HTML

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

  const fetchGenerations = async () => {
    try {
      const response = await fetch('/generations');
      if (response.ok) {
        const generations = await response.json();
        generations.forEach(generation => {
          const option = document.createElement('option');
          option.text = generation;
          option.value = generation;
          generationsDropdown.add(option);
        });
      } else {
        console.error('Failed to fetch generations:', response.statusText);
        generationsDropdown.innerHTML = '<option value="" disabled selected>Error Loading</option>';
      }
    } catch (error) {
      console.error('Error fetching generations:', error.message);
      generationsDropdown.innerHTML = '<option value="" disabled selected>Error Loading</option>';
    }
  };

  await fetchMakes();
  await fetchModels();
  await fetchGenerations(); // Call the function to fetch and populate generations dropdown
});