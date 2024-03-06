async function permissionInsert(u_id) {
    let confirmResult = confirm("권한을 부여 하시겠습니까?");

    if (confirmResult) {
        const res = await axios({
            method: "patch",
            url: "/admin/permission",
            data: {
                u_id: u_id,
            },
        });
        if (res.data === true) {
            alert("권한부여 성공하였습니다.");
            location.reload();
        } else {
            alert("권한부여 실패하였습니다.");
        }
    } else {
        alert("부여 실패하였습니다");
    }
}
async function pwReset(u_id) {
    let confirmResult = confirm("초기화 하시겠습니까?\n초기화시 패스트워드는 sessac123 입니다.");
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
