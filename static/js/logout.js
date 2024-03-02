const form = document.forms["form_logout"];

function logout() {
    axios({
        method: "post",
        url: "/user/logout",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            const { msg } = res.data;
            alert(msg); // 로그아웃
            document.location.href = "/user";
        })
        .catch((err) => {
            alert("잘못된 요청입니다. 다시 시도해주세요.");
        });
}
