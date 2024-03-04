const form = document.forms["form_logout"];

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("login-btn")) return;
    document.location.href = "/user";
});
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("mypage-btn")) return;
    document.location.href = "/profile";
});

document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("logout-btn")) return;
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
});
