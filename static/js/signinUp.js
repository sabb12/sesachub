const tabButtons = document.querySelectorAll(".tabContainer .logReBtnContainer button");
const tabPanels = document.querySelectorAll(".tabContainer .tabPanel");

function showPanel(panelIndex, colorCode) {
    tabButtons.forEach(function (node) {
        node.style.backgroundColor = "#eeeeee";
        node.style.color = "";
    });

    tabButtons[panelIndex].style.backgroundColor = colorCode;
    tabButtons[panelIndex].style.color = "";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display = "block";
    tabPanels[panelIndex].style.backgroundColor = colorCode;
}

showPanel(0, "white");

function login() {
    const form = document.forms["sign_in_form"];

    // 유효성 체크
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    axios({
        method: "post",
        url: "/user/signin",
        data: {
            u_id: form.u_id.value,
            pw: form.pw.value,
        },
    }).then((res) => {
        // console.log(res);
        // console.log("res.data ::", res.data);
        const { success } = res.data;
        if (success) {
            alert("로그인 성공!😎");
            document.location.href = "/reservation";
        } else {
            alert("로그인 실패!😥 아이디와 비밀번호를 확인해주세요.");
            form.reset();
        }
    });
}
