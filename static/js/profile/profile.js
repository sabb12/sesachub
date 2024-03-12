async function updateProfileImg() {
    const form = document.forms["profile_form"];
    const fileInput = form.profile_img;
    const file = fileInput.files[0]; // 선택된 파일 가져오기

    if (!file) return alert("프로필 클릭 후 이미지를 업로드해주세요.");
    // formData
    const formData = new FormData();
    formData.append("profile_img", file); // FormData에 파일 추가

    try {
        await axios({
            method: "patch",
            url: "/profile/image",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data", // 파일 업로드 시 필요한 헤더
            },
        }).then((res) => {
            alert("프로필 이미지가 변경되었습니다.");
            location.reload();
        });
    } catch (error) {
        console.error("프로필 업로드 중 에러가 발생했습니다.", error);
        alert("프로필 업로드에 실패했습니다.");
    }
}

function deleteProfileImg() {
    const deleteConfirm = confirm("기본 프로필로 변경 하시겠습니까?");

    if (deleteConfirm) {
        axios({
            method: "delete",
            url: "/profile/image",
        }).then(() => {
            location.reload();
        });
    }
}

/* --------------------------------------------------------------------- */

const patterns = {
    nk_name: /^[가-힣a-zA-Z0-9]{2,16}$/,
    phone: /^(\d{9,11})$/,
    email: /^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
};

const inputs = document.querySelectorAll(".input_container.edit input");
const nkNameBtn = document.querySelector("#nk_name_check_btn");
const nkNameInput = document.querySelector("input[name=nk_name]");
let prevNkNameValue = nkNameInput.value;

inputs.forEach((input) => {
    input.addEventListener("click", (e) => {
        e.target.value = "";
    });
});

// 입력값 검증
inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        validate(e.target, patterns[e.target.attributes.name.value]);
    });
});

// 유효성 검증 함수
function validate(field, regex) {
    if (regex.test(field.value)) {
        showSuccess(field);
    } else {
        showError(field);
    }
}

function showError(input) {
    const formControl = input.parentElement;
    formControl.className = "input_container error";
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = "input_container success";
}

let nkNameFlag = false;

// 플래그 설정 함수
function setNkNameFlag(value) {
    nkNameFlag = value;
}

async function nkNameCheck() {
    const nkNamePattern = patterns.nk_name;

    if (!nkNamePattern.test(nkNameInput.value)) {
        alert("닉네임 양식에 맞게 작성해주세요.");
        nkNameInput.value = "";
        return;
    }

    try {
        await axios({
            method: "get",
            url: "/user/duplicate",
            params: {
                nk_name: nkNameInput.value,
            },
        }).then((res) => {
            if (res.data.isDuplicate)
                alert("이미 존재하는 닉네임입니다. 다른 닉네임을 입력해주세요.");
            else {
                alert("사용 가능한 닉네임 입니다.");
                setNkNameFlag(true);
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

nkNameBtn.addEventListener("click", nkNameCheck);

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
