const messageElement = document.getElementById("message");
let message = "";
if (messageElement) {
    message = messageElement.value;
    alert(message);
}

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
    if (!e.target.classList.contains("user-btn")) return;
    document.location.href = "/admin/user";
});
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("reserve-btn")) return;
    document.location.href = "/admin/reserve";
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

function toggleDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// 사용자가 다른 곳을 클릭했을 때 드롭다운 내용이 닫히도록 설정
window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};
