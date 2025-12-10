function savePlaylist(name, url, image) {
    fetch("/playlist/save_playlist", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, url, image})
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "ok") {
            console.log("Playlist saved!");
        } else if (data.status === "exists") {
            console.log("Already saved!");
        } else {
            console.log("Error:", data.message);
        }
    });
}

function deletePlaylist(url) {
    fetch("/playlist/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "ok") {
            console.log("Deleted");
        } else {
            console.log("Error:", data.message);
        }
    });
}

function toggleSave(button, name, url, image) {
    const icon = button.querySelector("i");
    const isSaved = button.dataset.saved === "true";

    if (isSaved) {
        // delete immediately
        deletePlaylist(url);
        button.dataset.saved = "false";
        icon.classList.remove("bi-suit-heart-fill");
        icon.classList.add("bi-suit-heart");
        console.log("Deleted:", name);
    } else {
        // save
        savePlaylist(name, url, image);
        button.dataset.saved = "true";
        icon.classList.remove("bi-suit-heart");
        icon.classList.add("bi-suit-heart-fill");
        console.log("Saved:", name);
    }
}

function closeFlash(btn) {
    const box = btn.parentElement;
    box.style.opacity = "0";
    setTimeout(() => box.remove(), 300);
}

document.addEventListener("DOMContentLoaded", () => {

    // ========== SHOW / HIDE PASSWORD ==========
    document.querySelectorAll(".toggle-password").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const input = document.getElementById(targetId);

            if (input.type === "password") {
                input.type = "text";
                btn.innerHTML = "<i class=\"bi bi-eye-slash\"></i>";
            } else {
                input.type = "password";
                btn.innerHTML = "<i class=\"bi bi-eye\"></i>";
            }
        });
    });


    // ========== PASSWORD VALIDATION AND HINTS ==========
    const passwordInput = document.getElementById("password");
    if (passwordInput) {

        const len = document.getElementById("len");
        const upper = document.getElementById("upper");
        const lower = document.getElementById("lower");
        const digit = document.getElementById("digit");

        const rules = [
            { element: len, check: v => v.length >= 8 },
            { element: upper, check: v => /[A-Z]/.test(v) },
            { element: lower, check: v => /[a-z]/.test(v) },
            { element: digit, check: v => /\d/.test(v) },
        ];

        passwordInput.addEventListener("input", () => {
            const value = passwordInput.value;

            rules.forEach(rule => {
                const ok = rule.check(value);

                rule.element.classList.toggle("hidden", ok);
            });
        });
    }
});
