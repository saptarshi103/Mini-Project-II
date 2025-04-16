document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded");

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
        console.error("❌ Contact form not found! Check if the ID is correct.");
        return;
    }

    console.log("✅ Contact form found!");

    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // ✅ Stop page refresh
        console.log("🚀 Form submission prevented!");

        const name = document.getElementById("contactName")?.value.trim();
        const email = document.getElementById("contactEmail")?.value.trim();
        const subject = document.getElementById("contactSubject")?.value.trim();
        const message = document.getElementById("contactMessage")?.value.trim();

        if (!name || !email || !subject || !message) {
            alert("⚠️ Please fill in all fields before submitting.");
            return;
        }

        const formData = { name, email, subject, message };

        console.log("📨 Sending form data:", formData); // Debugging log

        try {
            const response = await fetch("http://localhost:5500/api/contact/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("✅ Server response:", data); // Debugging log

            if (response.ok) {
                alert("✅ Message sent successfully!");
                contactForm.reset(); // Clear the form
            } else {
                alert(`❌ Error: ${data.message || "Failed to send message. Try again."}`);
            }
        } catch (error) {
            console.error("❌ Error submitting form:", error);
            alert("⚠️ Network error! Please check your connection and try again.");
        }
    });
});
