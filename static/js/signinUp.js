const tabButtons = document.querySelectorAll(".tab_container .log_re_btn_container button");
const tabPanels = document.querySelectorAll(".tab_container .tab_panel");

function showPanel(panelIndex, colorCode) {
    tabButtons.forEach(function (node) {
        node.style.backgroundColor = colorCode;
        node.style.color = "";
    });

    tabButtons[panelIndex].style.backgroundColor = "#E7FFE8";
    tabButtons[panelIndex].style.color = "";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display = "block";
    tabPanels[panelIndex].style.backgroundColor = colorCode;
}

showPanel(0, "white");

/* 정규표현식
    - 아이디: 영어 소문자, 숫자 1글자 이상이고 특수문자 x, 영어 대문자x, 한글x인 6~16글자 사이
    - 비밀번호: 영어 대소문자, 숫자, 특수문자 각 1글자이상 한글x인 총 8글자이상
    - 이름: 한글 2 ~ 5 글자
    - 닉네임: 한글, 영어 대소문자, 숫자로 2 ~ 16글자
    - 연락처: 숫자 7글자 or 11글자
    - 이메일: 영문 대소문자, 숫자로 한글x @포함 .포함
*/
const patterns = {
    u_id: /^(?=.*[A-Za-z])(?=.*\d)[a-z0-9_]{6,16}$/,
    pw: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    name: /^[가-힣]{2,5}$/,
    nk_name: /^[가-힣a-zA-Z0-9]{2,16}$/,
    phone: /^(\d{9,11})$/,
    email: /^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
};

// 입력값 검증
const inputs = document.querySelectorAll(".register_input input");
inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        validate(e.target, patterns[e.target.attributes.name.value]);
    });
});

// 유효성 검증 함수
function validate(field, regex) {
    if (field.name === "pw_check") {
        // 비밀번호 재확인 필드일 경우
        const passwordField = document.forms["sign_up_form"]["pw"];
        if (field.value === passwordField.value) {
            // 비밀번호와 일치할 경우
            showSuccess(field);
        } else {
            // 비밀번호와 불일치할 경우
            showError(field);
        }
    } else if (regex.test(field.value)) {
        // 다른 필드들은 정규표현식으로 검증
        showSuccess(field);
    } else {
        // 유효성 검증 실패
        showError(field);
    }
}

function showError(input) {
    const formControl = input.parentElement;
    formControl.className = "register_input error";
    formControl.querySelector("small").style.visibility = "visible";
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "register_input success";
    formControl.querySelector("small").style.visibility = "hidden";
}

// 중복 확인
document.querySelector(".duplicate_check button").addEventListener("click", async function () {
    let u_id = document.querySelector("#u_id");

    if (!patterns.u_id.test(u_id.value)) {
        alert("아이디 양식에 맞게 작성해주세요.");
        u_id.value = "";
        return;
    }

    if (u_id.value) {
        try {
            let res = await axios({
                method: "get",
                url: `/user/duplicate?u_id=${u_id.value}`,
            });

            if (res.data.isDuplicate) {
                alert("이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요.");
            } else {
                alert("사용 가능한 아이디입니다.");
                let btn = document.querySelector(".duplicate_check button");
                btn.classList.add("checked");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        alert("아이디를 입력해주세요.");
    }
});

// 가입하기
function signup() {
    const form = document.forms["sign_up_form"];
    console.log(form);
    axios({
        method: "post",
        url: "/user/signup",
        data: {
            u_id: form.u_id.value,
            pw: form.pw.value,
            name: form.name.value,
            nk_name: form.nk_name.value,
            email: form.email.value,
            phone: form.phone.value,
            cs_id: form.cs_id.value,
        },
    }).then((res) => {
        alert(res.data);
        document.location.reload();
    });
}

function signin() {
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
