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

function updateProfile() {
    const form = document.forms["profile_form"];

    axios({
        method: "patch",
        url: "/profile",
        data: {
            name: form.name.value,
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
