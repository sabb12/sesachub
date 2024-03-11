// 게시글 체크박스
const posting_checkAll = document.querySelector("#posting_checkAll");
const posting_chkbx = document.querySelectorAll(".posting_check-option");

// 전체 선택 체크박스
posting_checkAll.addEventListener("change", (e) => {
    const isChecked = posting_checkAll.checked;
    posting_chkbx.forEach((checkbox) => {
        checkbox.checked = isChecked;
    });
});

// 각 체크박스
posting_chkbx.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        const allChecked = Array.from(posting_chkbx).every((checkbox) => checkbox.checked);
        posting_checkAll.checked = allChecked;
    });
});

// BookMark 체크박스
const bookMark_checkAll = document.querySelector("#bookMark_checkAll");
const bookMark_chkbx = document.querySelectorAll(".bookMark_check-option");

// 전체 선택 체크박스
bookMark_checkAll.addEventListener("change", (e) => {
    const isChecked = bookMark_checkAll.checked;
    bookMark_chkbx.forEach((checkbox) => {
        checkbox.checked = isChecked;
    });
});

// 각 체크박스
bookMark_chkbx.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        const allChecked = Array.from(bookMark_chkbx).every((checkbox) => checkbox.checked);
        bookMark_checkAll.checked = allChecked;
    });
});

function deleteButton(btn, b_id) {
    const areYouSure = confirm("삭제하시겠습니까?");
    if (areYouSure) {
        axios({
            method: "DELETE",
            url: "/board",
            params: { b_id: b_id },
        })
            .then(function (res) {
                // console.log("res.params.u_id", res.params.u_id);
                btn.parentElement.remove();
                document.location.href = "/profile/posting";
            })
            .catch((error) => {
                console.error("Error deleting reservation:", error);
            });
    }
}

function unmark_bookmark(btn, b_id, u_id) {
    const bookmark = document.getElementById("bookmark");
    axios({
        method: "POST",
        url: "/board/bookmark",
        data: {
            b_id: b_id,
            u_id: u_id,
        },
    }).then(function (res) {
        btn.parentElement.remove();
        bookmark.classList.remove("on");
    });
}
