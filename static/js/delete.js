function deleteAccount() {
    const form = document.forms["delete_form"];
    axios({
        method: "DELETE",
        url: "/user",
        data: {
            u_id: form.u_id.value,
            pw: form.pw.value,
        },
    }).then((res) => {
        console.log("res.data: ", res.data);
        alert(res.data);
        document.location.href = "/user";
    });
}
