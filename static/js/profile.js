function updateProfile() {
    console.log("clicking");
    const form = document.forms["profile_form"];

    axios({
        method: "patch",
        url: "/profile",
        data: {
            name: form.name.value,
            // u_id: form.u_id.value,
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
