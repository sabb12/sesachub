function updateProfile() {
    console.log("clicking");
    const form = document.forms["profile_form"];

    axios({
        method: "patch",
        url: "/profile",
        data: {
            name: form.name.value,
            pw: form.pw.value,
            nk_name: form.nk_name.value,
            phone: form.phone.value,
            email: form.email.value,
        },
    })
        .then((res) => {
            alert(res.data);
        })
        .catch((err) => console.error("update error", err));
}

const updatebtn = document.querySelector(".show_modal");
const closeBtn = document.querySelector(".close_btn");
const popupContainer = document.querySelector(".modal_container");

updatebtn.addEventListener("click", (e) => {
    e.preventDefault();
    popupContainer.classList.add("active");
});
closeBtn.addEventListener("click", (e) => {
    
    popupContainer.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("modal_container")) return;
    popupContainer.classList.remove("active");
});
