document.addEventListener("DOMContentLoaded", async () => {
    // Populate States Dropdown
    const stateSelect = document.getElementById("states");

    try {
        const response = await fetch("http://localhost:8080/tax-backend/states", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch states");
        }

        const states = await response.json();

        // Clear existing options
        stateSelect.innerHTML = '<option value="">Select State</option>';

        // Populate the dropdown with the fetched states
        states.forEach((state) => {
            const option = document.createElement("option");
            option.value = state.stateId;
            option.textContent = state.state;
            stateSelect.appendChild(option);
        });

        // console.log(stateSelect.innerHTML);

        const parent = stateSelect.parentNode;
        parent.removeChild(stateSelect);
        parent.appendChild(stateSelect);

    } catch (error) {
        console.error("Error fetching states:", error);
        stateSelect.innerHTML = '<option value="">Failed to load states</option>';
    }

    let sId;
    let lgaId;

    const lgaSelect = document.getElementById("lga");

    // Handle State Change to Populate LGAs
stateSelect.addEventListener("change", async (e) => {
    const stateId = e.target.value; // Get the selected state ID

    sId = stateId;
    // console.log( e.target.value); // Get the selected state ID
    lgaSelect.innerHTML = '<option value="">Loading...</option>'; // Show loading message

    if (!stateId) {
        lgaSelect.innerHTML = '<option value="">All LGA</option>'; // Reset LGA dropdown if no state is selected
        return;
    }

    try {
        // Fetch LGAs for the selected state
        const response = await fetch(`http://localhost:8080/tax-backend/state/lgas/${stateId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch LGAs");
        }

        const result = await response.json();
        const lgas = result.data;
        lgaSelect.innerHTML = '<option value="">Select LGA</option>';

        // Populate the LGA dropdown with the fetched LGAs
        lgas.forEach((lga) => {
            const option = document.createElement("option");
            option.value = lga.id;
            option.textContent = lga.lga;
            lgaSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading LGAs:", error);
        lgaSelect.innerHTML = '<option value="">Failed to load LGAs</option>'; // Show error message in dropdown
    }
});


lgaSelect.addEventListener("change", async (e) => {
    const lgId = e.target.value; // Get the selected state ID

    lgaId = lgId;
});

    // Populate Business Types Dropdown
    const businessTypeSelect = document.getElementById("businessType");

    try {
        const response = await fetch("http://localhost:8080/tax-backend/business-types", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch business types");
        }

        const result = await response.json();
        const businessTypes = result.data;

        // Populate the dropdown with the fetched business types
        businessTypes.forEach((type) => {
            const option = document.createElement("option");
            option.value = type.id;
            option.textContent = type.businessType;
            businessTypeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching business types:", error);
        businessTypeSelect.innerHTML = '<option value="">Failed to load business types</option>';
    }

    // Handle Form Submission
    document.getElementById("signupForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        // Get input values
        const businessName = document.getElementById("businessName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const idType = getSelectedIdType();
        const idNumber = document.getElementById("idNumber").value.trim();
        const businessType = document.getElementById("businessType").value.trim();
        const staffQuota = document.getElementById("staffQuota").value.trim();
        const cacNumber = document.getElementById("cacNumber").value.trim();
        const tinNumber = document.getElementById("tinNumber").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // Validate inputs
        if (!businessName || !email || !phone || !address || !idType || !idNumber || !businessType || !staffQuota) {
            displayMessage("Please fill in all required fields.", "red");
            return;
        }

        if (password !== confirmPassword) {
            displayMessage("Passwords do not match.", "red");
            return;
        }

      
        try {
            const stateName = await getStateName(sId);
            const lgaName = await getLgaName(lgaId);

            // Send registration request
            const response = await fetch("http://localhost:8080/tax-backend/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                        businessName,
                        email,
                        phone,
                        address,
                        idType,
                        idNumber,
                        businessType,
                        staffQuota,
                        cacNumber,
                        tinNumber,
                        password,
                        sId,
                        lgaId,
                        stateName,
                        lgaName
                }),
            });

            if (response.ok) {
            //     console.log({
            //         businessName,
            //         email,
            //         phone,
            //         address,
            //         idType,
            //         idNumber,
            //         businessType,
            //         staffQuota,
            //         cacNumber,
            //         tinNumber,
            //         password,
            //         sId,
            //         lgaId,
            //         stateName,
            //         lgaName
            // });

                const result = await response.json();

                if (result.status === "error") {
                    displayMessage(result.message || "Registration failed!", "red");
                    return;
                }

                // Show success message
                displayMessage("Registration successful! Please check your email for verification.", "green");
                document.getElementById("step-4").style.display = "none";
                document.getElementById("addNewBO").style.display = "block";
            } else {
                throw new Error("Failed to register");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            displayMessage("An unexpected error occurred. Please try again later.", "red");
        }
    });

    // Function to get the selected radio input value
    function getSelectedIdType() {
        const selectedRadio = document.querySelector('input[name="identityType"]:checked');
        return selectedRadio ? selectedRadio.value : null;
    }

    // Function to display messages
    function displayMessage(message, color) {
        const messageElement = document.getElementById("message");
        messageElement.innerText = message;
        messageElement.style.color = color;
        messageElement.style.display = "block";
    }
});



// Function to fetch state name by state ID
async function getStateName(stateId) {
    try {
        const response = await fetch(`http://localhost:8080/tax-backend/state/${stateId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch state name");
        }

        const result = await response.json();
        return result.data.state; // Assuming the API returns the state name in `result.data.state`
    } catch (error) {
        console.error("Error fetching state name:", error);
        return null; // Return null if an error occurs
    }
}

// Function to fetch LGA name by LGA ID
async function getLgaName(lgaId) {
    try {
        const response = await fetch(`http://localhost:8080/tax-backend/lga/${lgaId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch LGA name");
        }

        const result = await response.json();
        return result.data.lga; // Assuming the API returns the LGA name in `result.data.lga`
    } catch (error) {
        console.error("Error fetching LGA name:", error);
        return null; // Return null if an error occurs
    }
}