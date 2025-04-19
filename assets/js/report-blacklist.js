document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".needs-validation");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission
        event.stopPropagation(); // Stop propagation of the event

        // Check if the form is valid
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const agentId = localStorage.getItem("agentId");

        // Collect form values
        const fullName = document.getElementById("fullName").value.trim();
        const businessName = document.getElementById("businessName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const reason = document.getElementById("reason").value.trim();

        // Prepare the payload
        const payload = {
            businessOwner: fullName,
            reportedBy: agentId,
            businessName: businessName,
            phone: phone,
            email: email,
            address: address,
            reason: reason,
        };

        try {
            // Make the POST request
            const response = await fetch("http://localhost:8080/tax-backend/agent/blacklist-business", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to submit the blacklist report");
            }

            const result = await response.json();
            // console.log("Blacklist report submitted successfully:", result);

            // Optionally, show a success message or redirect
            alert("Blacklist report submitted successfully!");
            form.reset(); // Reset the form
            form.classList.remove("was-validated");
        } catch (error) {
            console.error("Error submitting blacklist report:", error);
            alert("An error occurred while submitting the report. Please try again.");
        }
    });
});