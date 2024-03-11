const checkAll = document.querySelector("#checkAll");
const chkbx = document.querySelectorAll(".check-option");

// 전체 선택 체크박스
checkAll.addEventListener("change", (e) => {
    const isChecked = checkAll.checked;
    chkbx.forEach((checkbox) => {
        checkbox.checked = isChecked;
    });
});

// 각 체크박스
chkbx.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        const allChecked = Array.from(chkbx).every((checkbox) => checkbox.checked);
        checkAll.checked = allChecked;
    });
});

/// 각 예약 정보 삭제
function deleteButton(r_id, u_id) {
    const areYouSure = confirm("삭제하시겠습니까?");
    if (areYouSure) {
        axios({
            method: "DELETE",
            url: "/profile/reservation",
            data: { r_id: r_id, u_id: u_id },
        })
            .then(function (res) {
                location.href = "/profile/confirmation";
            })
            .catch((error) => {
                console.error("Error deleting reservation:", error);
            });
    }
}

// 체크 된 예약 정보 전부 삭제
function deleteAllCheckedBtn() {
    const checkedReservations = Array.from(document.querySelectorAll(".check-option:checked")).map(
        (checkbox) => {
            return checkbox.parentElement.parentElement;
        },
    );
    if (checkedReservations.length > 0) {
        const areYouSure = confirm("삭제하시겠습니까?");
        if (areYouSure) {
            for (let checkedEl of checkedReservations) {
                const r_id = checkedEl.querySelector(".check-option").getAttribute("data-r-id");
                const u_id = checkedEl.querySelector(".check-option").getAttribute("data-u-id");
                axios({
                    method: "DELETE",
                    url: "/profile/reservation",
                    data: {
                        r_id: r_id,
                        u_id: u_id,
                    },
                })
                    .then(function (res) {
                        location.href = "/profile/confirmation";
                        // checkedEl.remove();
                        checkAll.checked = false;
                    })
                    .catch((error) => {
                        console.error("Error deleting reservation:", error);
                    });
            }
        }
    }
}
