// 게시글 체크박스
const posting_checkAll = document.querySelector("#posting_checkAll");
const posting_chkbx = document.querySelectorAll(".posting_check-option");

// 1. 전체 선택 체크박스
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

// 2. BookMark 체크박스
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

// 각 게시글 삭제
function deletePosting(b_id) {
    const areYouSure = confirm("삭제하시겠습니까?");
    if (areYouSure) {
        axios({
            method: "DELETE",
            url: "/board",
            params: { b_id: b_id },
        })
            .then(function (res) {
                location.href = "/profile/posting";
            })
            .catch((error) => {
                console.error("Error deleting reservation:", error);
            });
    }
}

// 체크 된 게시글 전부 삭제
function deletePostingAll() {
    const checkedPostings = Array.from(
        document.querySelectorAll(".posting_check-option:checked"),
    ).map((checkbox) => {
        return checkbox.parentElement.parentElement;
    });
    if (checkedPostings.length > 0) {
        const areYouSure = confirm("전체 삭제하시겠습니까?");
        if (areYouSure) {
            for (let posting of checkedPostings) {
                const b_id = posting
                    .querySelector(".posting_check-option")
                    .getAttribute("data-b-id");
                axios({
                    method: "DELETE",
                    url: "/board",
                    params: {
                        b_id: b_id,
                    },
                })
                    .then(function (res) {
                        location.href = "/profile/posting";
                        posting.checked = false;
                    })
                    .catch((error) => {
                        console.error("Error deleting posting:", error);
                    });
            }
        }
    }
}

// 각 북마크 삭제
function deletBookmark(b_id, u_id) {
    const areYouSure = confirm("삭제하시겠습니까?");
    if (areYouSure) {
        axios({
            method: "POST",
            url: "/board/bookmark",
            data: {
                b_id: b_id,
                u_id: u_id,
            },
        }).then(function (res) {
            location.href = "/profile/posting";
        });
    }
}

function deleteBookmarkAll() {
    const checkedBookMark = Array.from(
        document.querySelectorAll(".bookMark_check-option:checked"),
    ).map((checkbox) => {
        return checkbox.parentElement.parentElement;
    });
    if (checkedBookMark.length > 0) {
        const areYouSure = confirm("전체 삭제하시겠습니까?");
        if (areYouSure) {
            for (let bookmark of checkedBookMark) {
                const b_id = bookmark
                    .querySelector(".bookMark_check-option")
                    .getAttribute("data-b-id");
                const u_id = bookmark
                    .querySelector(".bookMark_check-option")
                    .getAttribute("data-u-id");
                const title = bookmark
                    .querySelector(".bookMark_check-option")
                    .getAttribute("data-title");
                axios({
                    method: "DELETE",
                    url: "/board",
                    params: {
                        b_id: b_id,
                        u_id: u_id,
                    },
                })
                    .then(function (res) {
                        location.href = "/profile/posting";
                        bookmark.checked = false;
                    })
                    .catch((error) => {
                        console.error("Error deleting bookMark:", error);
                    });
            }
        }
    }
}
