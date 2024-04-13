document.addEventListener('DOMContentLoaded', async () => {
  const makesDropdown = document.getElementById('makeDropdown');
  const modelsDropdown = document.getElementById('modelDropdown');
  const generationsDropdown = document.getElementById('generationDropdown');

  const fetchMakes = async () => {
    const response = await fetch('/makes');
    const makes = await response.json();
    makes.forEach(make => {
      const option = document.createElement('option');
      option.text = make;
      makesDropdown.add(option);
    });
  };

  const fetchModelsForGenerationAndMake = async (generation, make) => {
    // Fetch models for the selected generation and make
    modelsDropdown.innerHTML = '<option value="" disabled selected>Loading...</option>';
    const response = await fetch(`/models/${generation}/${make}`);
    if (response.ok) {
      const models = await response.json();
      modelsDropdown.innerHTML = '<option value="" disabled selected>Select Model</option>';
      models.forEach(model => {
        const option = document.createElement('option');
        option.text = model;
        modelsDropdown.add(option);
      });
      modelsDropdown.disabled = false;
    } else {
      console.error('Failed to fetch models:', response.statusText);
      modelsDropdown.innerHTML = '<option value="" disabled selected>Error Loading Models</option>';
      modelsDropdown.disabled = true;
    }
  };

  // Event listener for make dropdown
  makesDropdown.addEventListener('change', async () => {
    // Reset generation dropdown
    generationsDropdown.selectedIndex = 0;

    const selectedGeneration = generationsDropdown.value;
    const selectedMake = makesDropdown.value;
    if (selectedGeneration && selectedMake) {
      await fetchModelsForGenerationAndMake(selectedGeneration, selectedMake);
    } else {
      modelsDropdown.innerHTML = '<option value="" disabled selected>Select Model</option>';
      modelsDropdown.disabled = true;
    }
  });

  // Event listener for model dropdown
  modelsDropdown.addEventListener('change', async () => {
    const selectedModel = modelsDropdown.value;
    const selectedGeneration = generationsDropdown.value;
    const selectedMake = makesDropdown.value;
    // Handle model selection here
  });

  // Event listener for generation dropdown
  generationsDropdown.addEventListener('change', async () => {
    const selectedGeneration = generationsDropdown.value;
    const selectedMake = makesDropdown.value;
    if (selectedGeneration && selectedMake) {
      await fetchModelsForGenerationAndMake(selectedGeneration, selectedMake);
    } else {
      modelsDropdown.innerHTML = '<option value="" disabled selected>Select Model</option>';
      modelsDropdown.disabled = true;
    }
  });

  await fetchMakes();
});