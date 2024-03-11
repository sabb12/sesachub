function deleteAccount() {
    const form = document.forms["delete_account_form"];
    axios({
        method: "DELETE",
        url: "/user",
        data: {
            u_id: form.u_id.value,
            pw: form.pw.value,
        },
    }).then((res) => {
        document.location.href = "/profile/deleteAccount";
    });
}
