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

const updateBtn = document.querySelector(".show_modal");
const popupContainer = document.querySelector(".modal_container");

// 모달 열기
updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    popupContainer.classList.add("active");
});

// 모달 여백 클릭 시 닫힘
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("modal_container")) return;
    popupContainer.classList.remove("active");
});

// function updatePw(e) {
//     e.preventDefault();
//     // const form = document.forms[".modal_form"];

//     console.log(
//         // "form.pw.value",
//         // form.pw.value,
//         // "form.newPw.value",
//         // form.newPw.value,
//         // "form.newPwCheck",
//         // form.newPwCheck.value,
//         "click",
//         e.target,
//     );
//     // axios({
//     //     method: "patch",
//     //     url: "/profile/password",
//     //     data: {
//     //         pw: form.pw.value,
//     //         newPw: form.newPw.value,
//     //         newPwCheck: form.newPwCheck.value,
//     //     },
//     // })
//     //     .then((res) => {
//     //         alert(res.data);
//     //         popupContainer.classList.remove("active");
//     //     })
//     //     .catch((err) => console.error("update error", err));
// }

document.querySelector(".close_btn").addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.forms["modal_form"];

    axios({
        method: "patch",
        url: "/profile/password",
        data: {
            pw: form.pw.value,
            newPw: form.newPw.value,
            newPwCheck: form.newPwCheck.value,
        },
    })
        .then((res) => {
            const { success, msg } = res.data;
            if (success) {
                alert(msg);
                form.pw.value = "";
                form.newPw.value = "";
                form.newPwCheck.value = "";
                popupContainer.classList.remove("active");
            } else {
                alert(msg);
                form.pw.value = "";
                form.newPw.value = "";
                form.newPwCheck.value = "";
            }
        })
        .catch((err) => console.error("update error", err));
});
