function permissionAdd(u_id){
    var selectValue = document.getElementById('permissionSelect').value;
    permissionInsert(u_id,selectValue)
}

async function permissionInsert(u_id,selectValue) {
    let confirmResult = confirm("권한을 부여 하시겠습니까?");

    if (confirmResult) {
        const res = await axios({
            method: "patch",
            url: "/admin/permission",
            data: {
                u_id: u_id,
                selectValue:selectValue
            },
        });
        if (res.data === true) {
            alert("권한부여 성공하였습니다.\n회원관리 페이지로 이동합니다.");
            location.href = "/admin/user";
        } else {
            alert("권한부여 실패하였습니다.");
        }
    } else {
        alert("부여 실패하였습니다");
    }
}
async function pwReset(u_id) {
    let confirmResult = confirm("초기화 하시겠습니까?\n초기화시 비밀번호는 sesac123 입니다.");
    if (confirmResult) {
        const res = await axios({
            method: "patch",
            url: "/admin/user",
            data: { u_id: u_id },
        });
        if (res.data === true) {
            alert("초기화에 성공 하였습니다");
        } else {
            alert("초기화에 실패 하였습니다");
        }
    } else {
        alert("초기화에 취소 하였습니다");
    }
}
