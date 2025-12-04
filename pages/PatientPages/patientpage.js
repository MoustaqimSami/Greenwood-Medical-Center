function myFunction() {
            var input, filter, table, tr, td, i, txtValue;
            input = document.getElementById("myInput");
            filter = input.value.toUpperCase();
            table = document.getElementById("myTable");
            tr = table.getElementsByTagName("tr");
            for (i = 0; i < tr.length; i++) {
              td = tr[i].getElementsByTagName("td")[0];
              if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                } else {
                  tr[i].style.display = "none";
                }
              }       
            } 
          }

function addNewPatient() {
    // 1. Read input values
    const nameInput = document.getElementById('newName').value;
    const ageInput = parseInt(document.getElementById('newAge').value);
    const genderInput = document.getElementById('newGender').value;
    const phoneInput = document.getElementById('newPhone').value;
    const feedback = document.getElementById('feedbackMessage');

    // Basic Validation
    if (!nameInput || !ageInput || !genderInput || !phoneInput) {
        feedback.textContent = "Please fill out all fields.";
        feedback.style.color = 'red';
        return;
    }

    // 2. Generate a new unique ID
    // **This line accesses the array defined in patientsDatabase.js**
    const currentPatients = window.patientsDatabase.patients; 
    
    const nextIdNumber = currentPatients.length + 1;
    const newId = `pat-${nextIdNumber}`;

    // 3. Create the new patient object
    const newPatient = {
        "id": newId,
        "name": nameInput,
        "age": ageInput,
        "gender": genderInput,
        "phone": phoneInput
    };

    // 4. Add the new patient to the database
    currentPatients.push(newPatient);

    // 5. Provide feedback and reset form
    document.getElementById('newName').value = '';
    document.getElementById('newAge').value = '';
    document.getElementById('newGender').value = '';
    document.getElementById('newPhone').value = '';
    
    feedback.textContent = `Success! ${nameInput} (ID: ${newId}) has been added.`;
    feedback.style.color = 'green';
    
    console.log(`New patient count: ${currentPatients.length}`);
    console.log("Newly added patient:", newPatient);
}