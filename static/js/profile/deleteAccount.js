function deleteAccount() {
    const form = document.forms["delete_account_form"];
    const areYouSure = confirm("정말 회원 탈퇴 하시겠습니까?");
    if (areYouSure) {
        axios({
            method: "DELETE",
            url: "/user",
            data: {
                u_id: form.u_id.value,
                pw: form.pw.value,
            },
        }).then((res) => {
            document.location.href = "/";
        });
    }
}
